drop sequence if exists id_sequence;
create sequence id_sequence;

drop function if exists generate_id();
create function generate_id(out result bigint) as $$
declare
  our_epoch bigint := 1500000000000;
  seq_id bigint;
  now_millis bigint;
  shard_id int := 1;
begin
    select nextval('id_sequence') % 1024 INTO seq_id;
    select floor(extract(epoch FROM clock_timestamp()) * 1000) into now_millis;
    result := (now_millis - our_epoch) << 23;
    result := result | (shard_id << 10);
    result := result | (seq_id);
end
$$ language plpgsql;

drop function if exists now_utc();
create function now_utc() returns timestamp as $$
  select (now() at time zone 'utc')
$$ language sql;

create or replace function coins_per_hour(var_symbol text, var_hashrate numeric, out var_result numeric)
as $$
declare
  var_network record;
  var_shareofwork numeric;
begin
  select * from networkdata nd into var_network
    where nd.symbol = var_symbol
    order by time desc limit 1;
  select (var_hashrate / var_network.networkhashrate) into var_shareofwork;
  select (3600 * var_shareofwork * var_network.blockreward) / var_network.blocktime::numeric into var_result;
end
$$ language plpgsql;

create or replace function aggregate_measures(out result boolean)
returns boolean as $$
declare
  var_starttime timestamp;
  var_endtime timestamp;
begin
  select lastaggregation from meta into var_starttime;
  select date_trunc('minute', time) from measures order by time desc limit 1 into var_endtime;
  select aggregate_measures_between(var_starttime, var_endtime) into result;
  update meta set lastaggregation = var_endtime;
end
$$ language plpgsql;

create or replace function aggregate_measures_between(var_starttime timestamp, var_endtime timestamp)
returns boolean as $$
begin

  with
  aggregation_groups as (
    select distinct
      device.groupid,
      device.agentid,
      measure.deviceid,
      measure.symbol
    from measures measure
      join devices device on device.id = measure.deviceid
    where measure.time between var_starttime and var_endtime
  ),
  time_buckets as (
    select
      time,
      groupid,
      agentid,
      deviceid,
      symbol
    from generate_series(var_starttime, var_endtime, '1 minute') time
    join aggregation_groups on 1=1
  ),
  device_samples as (
    select
      bucket.time,
      bucket.groupid,
      bucket.agentid,
      bucket.deviceid,
      bucket.symbol,
      count(*) as numsamples,
      coalesce(avg(hashrate), 0) as hashrate,
      coins_per_hour(bucket.symbol, coalesce(avg(hashrate), 0)) as coins,
      avg(load) as load,
      avg(power) as power,
      avg(temp) as temp,
      avg(coreclock) as coreclock,
      avg(ramclock) as ramclock,
      avg(fanrpm) as fanrpm,
      avg(fanpercent) as fanpercent
    from time_buckets bucket
      left join measures measure on
        bucket.time = date_trunc('minute', measure.time) and
        bucket.deviceid = measure.deviceid and
        bucket.symbol = measure.symbol
    group by
      bucket.time, bucket.groupid, bucket.agentid, bucket.deviceid, bucket.symbol
  )
  insert into samples (
    time,
    groupid,
    agentid,
    deviceid,
    symbol,
    hashrate,
    coins,
    load,
    power,
    temp,
    coreclock,
    ramclock,
    fanrpm,
    fanpercent
  )
  select
    time,
    groupid,
    agentid,
    deviceid,
    symbol,
    sum(hashrate) as hashrate,
    sum(coins) as coins,
    avg(load) as load,
    avg(power) as power,
    avg(temp) as temp,
    avg(coreclock) as coreclock,
    avg(ramclock) as ramclock,
    avg(fanrpm) as fanrpm,
    avg(fanpercent) as fanpercent
  from device_samples
    where numsamples > 0
  group by
    time, groupid, rollup(agentid, deviceid), symbol;

  return true;
end
$$ language plpgsql;
