import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"
import { User, UserHandler } from './user'
import { doesNotReject } from 'assert';

const dbPath: string = 'db_test'
var dbMet: MetricsHandler
var dbUser : UserHandler
var testMetric : Metric[] = [new Metric('2017-06-04 15:00', 2),new Metric('2017-06-05 16:00', 2)]

var testUser = new User("test", "t@t.com", "t");


describe('Metrics and Users', function () {
  before(function () {
    LevelDb.clear(dbPath)
    
    dbMet = new MetricsHandler(dbPath+"/Met")
    dbUser= new UserHandler(dbPath+"/User")
    dbUser.save(testUser, (err: Error | null) => {
      if (err) throw err
    })
    
    
  })


  describe('#save metrics', function () {
    it('should create and save a metric in the db', function () {
      dbMet.save("test",testMetric,function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.be.undefined
  
      })
    })
  })

  describe('#get user',function(){
    it('should get empty array on non existing user', function () {
      dbUser.get("notExisting", function (err: Error | null, result?: User){
        expect(err).to.be.null
        expect(result).to.be.undefined
       
      })
    })

    it('should return a user if he exist',function(){
      dbUser.get("test",function (err: Error | null, result?: User){
    
        //expect(result).to.equal(testUser) 
        expect(err).to.be.null
        console.log("get user result : "+result)
       
      })
    })
  })
  

  describe('#get metrics', function () {
    it('should get empty array on non existing user', function () {
      dbMet.get("0",function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
       
       
      })
    })

    it('should return all the metrics of user if he exist', function () {
      dbMet.get("test",function (err: Error | null, result?: Metric[]) {
        
    
        expect(result).to.not.be.undefined
        expect(result).to.equal(testMetric)
        var resultM = result  
       
      })
    })
  })


  after(function () {
    dbMet.db.close()
    console.log(testUser)
  })
})