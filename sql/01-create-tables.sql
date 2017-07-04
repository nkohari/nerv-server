create type device_kind as enum ('gpu', 'cpu', 'usb');

create table users (
  id uuid primary key,
  created timestamp,
  username text,
  password text
);

create table agents (
  id uuid primary key,
  created timestamp,
  userid uuid,
  name text
);

create table devices (
  id uuid primary key,
  created timestamp,
  userid uuid,
  agentid uuid,
  kind device_kind,
  vendor text,
  model text
);

create table events (
  id uuid primary key,
  created timestamp,
  userid uuid,
  agentid uuid,
  deviceid uuid,
  properties jsonb
);
