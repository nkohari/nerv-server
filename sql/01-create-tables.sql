create type device_kind as enum ('gpu', 'cpu', 'usb');

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
  userid uuid,
  groupid uuid,
  name text
);

create table devices (
  id uuid not null primary key,
  created timestamp not null,
  version int not null,
  groupid uuid not null,
  agentid uuid not null,
  kind device_kind not null,
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
