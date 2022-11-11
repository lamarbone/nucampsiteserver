const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');

partnerRouter.route('/')

.get((req, res, next) => {
    Partner.find()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err));
})

.post((req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})

.delete((req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


partnerRouter.route('/:partnerId')



.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put((req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true})
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));    
})


.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));    
})
   
partnerRouter.route('/:partnerId')

.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.post((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
        partner.push(req.body);
        partner.save()
        .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
        })
        .catch(err => next(err));
     } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /partners/${req.params.partnerId}`);
})

.delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner) {
        for ( let i = (partner.length-1); i >= 0; i--) {
            partner.id(partner[i]._id).remove();
        }
        partner.save()
        .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
        })
        .catch(err => next(err));
     } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

partnerRouter.route('/:partnerId/')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.id(req.params.partnerId)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner.id(req.params.partnerId));
    } else if (!partner){
        err = new Error(`Partner ${req.params.partnerId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.id(req.params.partnerId)) {
            if (req.body.rating) {
                partner.id(req.params.partnerId).rating = req.body.rating;
            }
            if (req.body.text) {
                partner.id(req.params.partnerId).text = req.body.text;
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    } else if (!partner){
        err = new Error(`Partner ${req.params.partnerId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.delete((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        if (partner && partner.id(req.params.partnerId)) {
            partner.id(req.params.partnerId).remove();
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
    } else if (!partner){
        err = new Error(`Partner ${req.params.partnerId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});



module.exports = partnerRouter;