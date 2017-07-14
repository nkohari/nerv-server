create or replace function aggregate_measures(out result boolean)
returns boolean as $$
declare
  endtime timestamp := now();
begin
  select aggregate_measures_between((select lastaggregation from meta), endtime) into result;
  update meta set lastaggregation = endtime;
end
$$
language plpgsql;

create or replace function aggregate_measures_between(starttime timestamp, endtime timestamp)
returns boolean as $$
begin

  insert into aggregates (
    type, year, month, week, day, hour, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'avg', year, month, week, day, hour, groupid, agentid, deviceid, coin,
    avg(hashrate), avg(load), avg(power), avg(temp), avg(coreclock), avg(ramclock), avg(fanrpm), avg(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    year, month, week, day, hour,
    groupid, agentid, deviceid, coin;

  insert into aggregates (
    type, year, month, week, day, hour, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'min', year, month, week, day, hour, groupid, agentid, deviceid, coin,
    min(hashrate), min(load), min(power), min(temp), min(coreclock), min(ramclock), min(fanrpm), min(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    year, month, week, day, hour,
    groupid, agentid, deviceid, coin;

  insert into aggregates (
    type, year, month, week, day, hour, groupid, agentid, deviceid, coin,
    hashrate, load, power, temp, coreclock, ramclock, fanrpm, fanpercent
  )
  select
    'max', year, month, week, day, hour, groupid, agentid, deviceid, coin,
    max(hashrate), max(load), max(power), max(temp), max(coreclock), max(ramclock), max(fanrpm), max(fanpercent)
  from measures
    join timebuckets on date_trunc('hour', measures.time) = timebuckets.time
  where timebuckets.time between starttime and endtime
  group by
    year, month, week, day, hour,
    groupid, agentid, deviceid, coin;

  return true;
end;
$$
language plpgsql
