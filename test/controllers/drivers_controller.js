const assert = require ('assert');
const request = require('supertest');
const app = require ('../../app');
const mongoose = require('mongoose');

// mongoose express mocha does not work together sometimes nicely. This way the driver model is accessed better as a workaround.
const Driver = mongoose.model('driver');

describe('Drivers controller',()=>{

    it('Post to api/drivers creates a new driver', done => {
        Driver.count().then(count=>{
            request(app)
                .post('/api/drivers')
                .send({email: 'test@test.com'})
                .end(()=>{
                Driver.count().then(newCount=>{
                    assert(count+1===newCount);
                    done();
                });
            });
        }); 
    });

    it('Put to api/drivers/id edits an existing driver', done =>{
        const driver = new Driver ({email: 't@t.com',driving: false});
        driver.save().then(()=>{
            request(app)
                .put(`/api/drivers/${driver._id}`)
            // equivalent to .put('/api/drivers/' + driver._id)
                .send({driving: true})
                .end(()=>{
                Driver.findOne({email: 't@t.com'})
                    .then(driver =>{
                    assert(driver.driving === true);
                    done();
                });
            });
        });
    });

    it('Delete to api/drivers/id deletes a driver', done =>{
        Driver.count().then(count=>{
            const driver = new Driver ({email: 't@t.com'});
            driver.save().then(()=>{
                request(app)
                    .delete(`/api/drivers/${driver._id}`)
                // equivalent to .put('/api/drivers/' + driver._id)
                    .end()
                done();

                Driver.count().then(newCount=>{
                    assert(count===newCount);
                    done();
                });
            });
        })
    });   

    it('Get to api/drivers finds drivers in a location', done=> {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: {type: 'Point', coordinates:[-122,47]}
        });
        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: {type: 'Point', coordinates: [-80,25]}
        });

        Promise.all([seattleDriver.save(), miamiDriver.save()])
            .then(()=>{
            request(app)
                .get('/api/drivers?lng=-80.4&lat=25.1')
                .end((err,response)=>{
                assert(response.body.length === 1);
                assert(response.body[0].obj.email === 'miami@test.com');
                done();
            });
        });
    });

});
