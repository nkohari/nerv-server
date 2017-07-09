drop table users;
drop table groups;
drop table memberships;
drop table agents;
drop table devices;
drop table events;
drop type device_type;

create type device_type as enum ('gpu', 'cpu');

create table users (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  username text not null,
  password text not null,
  email text
);

create table groups (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  name text not null
);

create table memberships (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  userid uuid not null,
  groupid uuid not null
);

create table agents (
  id uuid primary key,
  created timestamp,
  version int not null,
  groupid uuid,
  name text
);

create table devices (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  groupid uuid not null,
  agentid uuid not null,
  type device_type not null,
  vendor text not null,
  model text not null
);

create table events (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  groupid uuid not null,
  agentid uuid not null,
  deviceid uuid not null,
  properties jsonb
);
