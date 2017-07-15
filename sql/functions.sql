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

create or replace function coins_per_second(coinid text, hashrate integer, out result numeric)
as $$
declare
  coin record;
  usershare numeric;
begin
  select * from coins into coin where id = coinid;
  select (hashrate::numeric / coin.networkhashrate::numeric) into usershare;
  select (usershare * coin.blockreward) / coin.blocktime::numeric into result;
end
$$ language plpgsql;

create or replace function aggregate_measures(out result boolean)
returns boolean as $$
declare
  endtime timestamp;
begin
  select date_trunc('hour', time) from measures order by time desc limit 1 into endtime;
  select aggregate_measures_between((select lastaggregation from meta), endtime) into result;
  update meta set lastaggregation = endtime;
end
$$ language plpgsql;

create or replace function aggregate_measures_between(starttime timestamp, endtime timestamp)
returns boolean as $$
begin

  with
  aggregation_groups as (
    select distinct
      groupid,
      agentid,
      deviceid,
      coin
    from measures where time between starttime and endtime
  ),
  minute_buckets as (
    select
      time,
      groupid,
      agentid,
      deviceid,
      coin
    from generate_series(starttime, endtime, '1 minute') time
    join aggregation_groups on 1=1
  ),
  hour_buckets as (
    select
      time,
      groupid,
      agentid,
      deviceid,
      coin
    from generate_series(starttime, endtime, '1 hour') time
    join aggregation_groups on 1=1
  ),
  measures_by_minute as (
    select
      minute_buckets.time,
      minute_buckets.groupid,
      minute_buckets.agentid,
      minute_buckets.deviceid,
      minute_buckets.coin,
      coalesce(avg(hashrate), 0) as avg_hashrate,
      avg(load) as avg_load,
      avg(power) as avg_power,
      avg(temp) as avg_temp,
      avg(coreclock) as avg_coreclock,
      avg(ramclock) as avg_ramclock,
      avg(fanrpm) as avg_fanrpm,
      avg(fanpercent) as avg_fanpercent,
      min(hashrate) as min_hashrate,
      min(load) as min_load,
      min(power) as min_power,
      min(temp) as min_temp,
      min(coreclock) as min_coreclock,
      min(ramclock) as min_ramclock,
      min(fanrpm) as min_fanrpm,
      min(fanpercent) as min_fanpercent,
      max(hashrate) as max_hashrate,
      max(load) as max_load,
      max(power) as max_power,
      max(temp) as max_temp,
      max(coreclock) as max_coreclock,
      max(ramclock) as max_ramclock,
      max(fanrpm) as max_fanrpm,
      max(fanpercent) as max_fanpercent
    from minute_buckets
      left join measures on
        minute_buckets.time = date_trunc('minute', measures.time) and
        minute_buckets.groupid = measures.groupid and
        minute_buckets.agentid = measures.agentid and
        minute_buckets.deviceid = measures.deviceid and
        minute_buckets.coin = measures.coin
    group by
      minute_buckets.time, minute_buckets.groupid, minute_buckets.agentid, minute_buckets.deviceid, minute_buckets.coin
  )
  insert into aggregates (
    time,
    groupid,
    agentid,
    deviceid,
    coin,
    hashrate,
    avg_hashrate,
    avg_load,
    avg_power,
    avg_temp,
    avg_coreclock,
    avg_ramclock,
    avg_fanrpm,
    avg_fanpercent,
    min_hashrate,
    min_load,
    min_power,
    min_temp,
    min_coreclock,
    min_ramclock,
    min_fanrpm,
    min_fanpercent,
    max_hashrate,
    max_load,
    max_power,
    max_temp,
    max_coreclock,
    max_ramclock,
    max_fanrpm,
    max_fanpercent
  )
  select
    hour_buckets.time,
    hour_buckets.groupid,
    hour_buckets.agentid,
    hour_buckets.deviceid,
    hour_buckets.coin,
    sum(avg_hashrate) as hashrate,
    avg(avg_hashrate) as avg_hashrate,
    avg(avg_load) as avg_load,
    avg(avg_power) as avg_power,
    avg(avg_temp) as avg_temp,
    avg(avg_coreclock) as avg_coreclock,
    avg(avg_ramclock) as avg_ramclock,
    avg(avg_fanrpm) as avg_fanrpm,
    avg(avg_fanpercent) as avg_fanpercent,
    min(min_hashrate) as min_hashrate,
    min(min_load) as min_load,
    min(min_power) as min_power,
    min(min_temp) as min_temp,
    min(min_coreclock) as min_coreclock,
    min(min_ramclock) as min_ramclock,
    min(min_fanrpm) as min_fanrpm,
    min(min_fanpercent) as min_fanpercent,
    max(max_hashrate) as max_hashrate,
    max(max_load) as max_load,
    max(max_power) as max_power,
    max(max_temp) as max_temp,
    max(max_coreclock) as max_coreclock,
    max(max_ramclock) as max_ramclock,
    max(max_fanrpm) as max_fanrpm,
    max(max_fanpercent) as max_fanpercent
  from measures_by_minute
    join hour_buckets on
      hour_buckets.time = date_trunc('minute', measures_by_minute.time) and
      hour_buckets.groupid = measures_by_minute.groupid and
      hour_buckets.agentid = measures_by_minute.agentid and
      hour_buckets.deviceid = measures_by_minute.deviceid and
      hour_buckets.coin = measures_by_minute.coin
  group by
    hour_buckets.time, hour_buckets.groupid, rollup(hour_buckets.agentid, hour_buckets.deviceid), hour_buckets.coin;

  return true;
end
$$ language plpgsql;
