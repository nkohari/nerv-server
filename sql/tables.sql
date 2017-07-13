-- internal tables

drop table if exists buckets;
drop table if exists etl;

create table meta (
  lastaggregation timestamp not null
);

create table buckets (
  id timestamp not null primary key,
  year smallint not null,
  month smallint not null,
  week smallint not null,
  day smallint not null,
  hour smallint not null
);

insert into buckets (id, year, month, day, week, hour)
(
  select
    date,
    extract(year from date),
    extract(month from date),
    extract(day from date),
    extract(week from date),
    extract(hour from date)
  from
  generate_series(
    '2015-01-01 00:00:00'::timestamp,
    '2050-01-01 00:00:00'::timestamp,
    '1 hour'
  ) date
);

--- regular tables

drop table users;
drop table groups;
drop table memberships;
drop table agents;
drop table devices;
drop table measures;
drop table aggregates;
drop type device_type;

create type device_type as enum ('gpu', 'cpu');

create table users (
  id uuid not null primary key,
  created timestamp not null default now(),
  updated timestamp not null default now(),
  deleted timestamp,
  version int not null default 1,
  username text not null,
  password text not null,
  email text
);

create table groups (
  id uuid not null primary key,
  created timestamp not null default now(),
  updated timestamp not null default now(),
  deleted timestamp,
  version int not null default 1,
  name text not null
);

create table memberships (
  id uuid not null primary key,
  created timestamp not null default now(),
  updated timestamp not null default now(),
  deleted timestamp,
  version int not null default 1,
  userid uuid not null,
  groupid uuid not null
);

create table agents (
  id uuid primary key,
  created timestamp not null default now(),
  updated timestamp not null default now(),
  deleted timestamp,
  version int not null default 1,
  groupid uuid,
  name text
);

create table devices (
  id uuid not null primary key,
  created timestamp not null default now(),
  updated timestamp not null default now(),
  deleted timestamp,
  version int not null default 1,
  groupid uuid not null,
  agentid uuid not null,
  type device_type not null,
  vendor text not null,
  model text not null
);

create table measures (
  id uuid not null primary key,
  created timestamp not null default now(),
  bucketid timestamp not null default date_trunc('hour', now()),
  groupid uuid not null,
  agentid uuid not null,
  deviceid uuid not null,
  coin text,
  hashrate int,
  load numeric(5, 4),
  power numeric(4, 2),
  coreclock smallint,
  ramclock smallint,
  temp smallint,
  fanpercent numeric(5, 4),
  fanrpm smallint
);

create table aggregates (
  id bigserial not null primary key,
  type text,
  bucketid timestamp not null,
  groupid uuid not null,
  agentid uuid not null,
  deviceid uuid not null,
  coin text,
  hashrate int,
  load numeric(5, 4),
  power numeric(4, 2),
  coreclock smallint,
  ramclock smallint,
  temp smallint,
  fanpercent numeric(5, 4),
  fanrpm smallint
);
