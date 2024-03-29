-- metadata

drop table if exists meta;
create table meta (
  lastaggregation timestamp not null
);

drop table if exists coins;
create table coins (
  symbol text not null,
  ccid text not null
);

insert into coins (symbol, ccid) values ('BTC', '1182');
insert into coins (symbol, ccid) values ('LTC', '3808');
insert into coins (symbol, ccid) values ('ETH', '7605');

drop table if exists currencies;
create table currencies (
  symbol text not null
);

insert into currencies (symbol) values ('BTC');
insert into currencies (symbol) values ('LTC');
insert into currencies (symbol) values ('ETH');
insert into currencies (symbol) values ('USD');
insert into currencies (symbol) values ('EUR');
insert into currencies (symbol) values ('CNY');
insert into currencies (symbol) values ('KRW');
insert into currencies (symbol) values ('RUB');
insert into currencies (symbol) values ('CAD');
insert into currencies (symbol) values ('JPY');
insert into currencies (symbol) values ('AUD');
insert into currencies (symbol) values ('RUR');
insert into currencies (symbol) values ('GBP');
insert into currencies (symbol) values ('SGD');
insert into currencies (symbol) values ('IDR');
insert into currencies (symbol) values ('INR');

drop table if exists networkdata;
create table networkdata (
  id bigint not null primary key default generate_id(),
  time timestamp not null default now_utc(),
  symbol text not null,
  algorithm text not null,
  blockreward numeric(10, 2) not null,
  blocktime smallint not null,
  networkhashrate bigint not null
);

drop table if exists exchangerates;
create table exchangerates (
  id bigint not null primary key default generate_id(),
  time timestamp not null default now_utc(),
  symbol text not null,
  currency text not null,
  amount numeric(16, 4) not null
);

--- regular tables

drop table if exists users;
create table users (
  id bigint not null primary key default generate_id(),
  created timestamp not null default now_utc(),
  updated timestamp not null default now_utc(),
  deleted timestamp,
  version int not null default 1,
  username text not null unique,
  password text not null,
  email text,
  currency text not null
);

drop table if exists groups;
create table groups (
  id bigint not null primary key default generate_id(),
  created timestamp not null default now_utc(),
  updated timestamp not null default now_utc(),
  deleted timestamp,
  version int not null default 1,
  name text not null
);

drop table if exists memberships;
create table memberships (
  id bigint not null primary key default generate_id(),
  created timestamp not null default now_utc(),
  updated timestamp not null default now_utc(),
  deleted timestamp,
  version int not null default 1,
  userid bigint not null,
  groupid bigint not null
);

drop table if exists agents;
create table agents (
  id bigint not null primary key default generate_id(),
  created timestamp not null default now_utc(),
  updated timestamp not null default now_utc(),
  deleted timestamp,
  version int not null default 1,
  groupid bigint,
  name text
);

drop table if exists devices;
create table devices (
  id bigint not null primary key default generate_id(),
  created timestamp not null default now_utc(),
  updated timestamp not null default now_utc(),
  deleted timestamp,
  version int not null default 1,
  groupid bigint not null,
  agentid bigint not null,
  name text not null,
  type text not null,
  vendor text not null,
  model text not null
);

drop table if exists measures;
create table measures (
  id bigint not null primary key default generate_id(),
  time timestamp not null default now_utc(),
  deviceid bigint not null,
  symbol text,
  hashrate int,
  load numeric(5, 4),
  power numeric(4, 2),
  coreclock smallint,
  ramclock smallint,
  temp smallint,
  fanpercent numeric(5, 4),
  fanrpm smallint
);

drop table if exists samples;
create table samples (
  id bigint not null primary key default generate_id(),
  time timestamp not null,
  groupid bigint,
  agentid bigint,
  deviceid bigint,
  symbol text,
  hashrate int,
  coins numeric(20, 10),
  load numeric(5, 4),
  power numeric(4, 2),
  coreclock smallint,
  ramclock smallint,
  temp smallint,
  fanpercent numeric(5, 4),
  fanrpm smallint
);
