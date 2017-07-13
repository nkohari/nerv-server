create or replace function precalc_aggregates()
returns boolean as $$
declare
  result boolean;
  endtime timestamp := now();
begin
  select aggregate_measures_between((select lastaggregation from meta), endtime) into result;
  update meta set lastaggregation = endtime;
  return result;
end
$$
language plpgsql;

create or replace function precalc_aggregates_between(starttime timestamp, endtime timestamp)
returns boolean as $$
begin

  insert into aggregates (
    type,
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    hashrate,
    load,
    power,
    temp,
    coreclock,
    ramclock,
    fanrpm,
    fanpercent
  )
  select
    'avg',
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    avg(hashrate),
    avg(load),
    avg(power),
    avg(temp),
    avg(coreclock),
    avg(ramclock),
    avg(fanrpm),
    avg(fanpercent)
  from measures
  join buckets on measures.bucketid = buckets.id
  where bucketid between starttime and endtime
  group by bucketid, groupid, agentid, deviceid, coin;

  insert into aggregates (
    type,
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    hashrate,
    load,
    power,
    temp,
    coreclock,
    ramclock,
    fanrpm,
    fanpercent
  )
  select
    'min',
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    min(hashrate),
    min(load),
    min(power),
    min(temp),
    min(coreclock),
    min(ramclock),
    min(fanrpm),
    min(fanpercent)
  from measures
  join buckets on measures.bucketid = buckets.id
  where bucketid between starttime and endtime
  group by bucketid, groupid, agentid, deviceid, coin;

  insert into aggregates (
    type,
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    hashrate,
    load,
    power,
    temp,
    coreclock,
    ramclock,
    fanrpm,
    fanpercent
  )
  select
    'max',
    groupid,
    agentid,
    deviceid,
    bucketid,
    coin,
    max(hashrate),
    max(load),
    max(power),
    max(temp),
    max(coreclock),
    max(ramclock),
    max(fanrpm),
    max(fanpercent)
  from measures
  join buckets on measures.bucketid = buckets.id
  where bucketid between starttime and endtime
  group by bucketid, groupid, agentid, deviceid, coin;

  return true;
end;
$$
language plpgsql
