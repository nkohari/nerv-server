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
  endtime timestamp := now();
begin
  select aggregate_measures_between((select lastaggregation from meta), endtime) into result;
  update meta set lastaggregation = endtime;
end
$$ language plpgsql;

create or replace function aggregate_measures_between(starttime timestamp, endtime timestamp)
returns boolean as $$
begin

  insert into aggregates (
    type, time, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'avg', timebuckets.time, groupid, agentid, deviceid, coin,
    avg(hashrate), avg(load), avg(power), avg(temp), avg(coreclock), avg(ramclock), avg(fanrpm), avg(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    timebuckets.time, groupid, rollup(agentid, deviceid), coin;

  insert into aggregates (
    type, time, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'min', timebuckets.time, groupid, agentid, deviceid, coin,
    min(hashrate), min(load), min(power), min(temp), min(coreclock), min(ramclock), min(fanrpm), min(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    timebuckets.time, groupid, rollup(agentid, deviceid), coin;

  insert into aggregates (
    type, time, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'max', timebuckets.time, groupid, agentid, deviceid, coin,
    max(hashrate), max(load), max(power), max(temp), max(coreclock), max(ramclock), max(fanrpm), max(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    timebuckets.time, groupid, rollup(agentid, deviceid), coin;

  return true;
end
$$ language plpgsql;
