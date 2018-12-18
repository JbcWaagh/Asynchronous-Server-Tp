#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/user'
import {LevelDb} from "../src/leveldb"

LevelDb.clear('db/metrics')
LevelDb.clear('db/users')
LevelDb.clear('db/sessions')
console.log('clear of pre-existing data')

const met : Metric[] = [
  new Metric( '2013-11-04 14:00 UTC' , 12),
  new Metric(  '2013-11-04 14:15 UTC' , 10),
  new Metric(  '2013-11-04 14:30 UTC' , 8),
  new Metric(  '2013-11-04 14:45 UTC' , 3),
  new Metric(  '2013-11-04 15:00 UTC' , 11),
  new Metric(  '2013-11-04 15:15 UTC' , 6)
]


const met2 : Metric[]  = [
  new Metric(  '2017-06-04 15:00 UTC' , 2),
  new Metric(  '2017-07-04 18:15 UTC' , 37),
  new Metric(  '2017-08-04 20:30 UTC' , 21),
  new Metric(  '2017-09-04 15:56 UTC' , 42),
  new Metric(  '2017-10-04 17:34 UTC' , 21),
  new Metric(  '2017-11-04 18:15 UTC' , 16)

]

const dbMet = new MetricsHandler('./db/metrics')
const dbUser = new UserHandler('./db/users')

const user = new User("Light", "sun@uni.com", "alpha");
const user2 = new User("Dark", "moon@uni.com", "beta");

dbMet.save('Light', met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated for Light metrics')
})

dbMet.save('Dark', met2, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated for Dark metrics')
})

dbUser.save(user, (err: Error | null) => {
  if (err) throw err
  console.log('Light account created')
})

dbUser.save(user2, (err: Error | null) => {
  if (err) throw err
  console.log('Dark account created')
})


