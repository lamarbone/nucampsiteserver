const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');

promotionRouter.route('/')

.get((req, res, next) => {
    Promotion.find()
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    })
    .catch(err => next(err));
})

.post(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})

.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotion.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


promotionRouter.route('/:promotionId')



.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})

.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));    
})


.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));    
})
   
promotionRouter.route('/:promotionId/')

.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
        } else {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
        promotion.push(req.body);
        promotion.save()
        .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
        })
        .catch(err => next(err));
     } else {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions/${req.params.promotionId}`);
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion) {
        for ( let i = (promotion.length-1); i >= 0; i--) {
            promotion.id(promotion.s[i]._id).remove();
        }
        promotion.save()
        .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
        })
        .catch(err => next(err));
     } else {
            err = new Error(`Promotion ${req.params.promotionId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

promotionRouter.route('/:promotionId/:Id')
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.id(req.params.Id)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion.id(req.params.Id));
    } else if (!promotion){
        err = new Error(`Promotion ${req.params.promotionId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Promotion ${req.params.Id} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}/s/
    ${req.params.Id}`);
})

.put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.id(req.params.Id)) {
            if (req.body.rating) {
                promotion.id(req.params.Id).rating = req.body.rating;
            }
            if (req.body.text) {
                promotion.id(req.params.Id).text = req.body.text;
            }
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    } else if (!promotion){
        err = new Error(`Promotion ${req.params.promotionId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Promotion ${req.params.Id} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => {
        if (promotion && promotion.id(req.params.Id)) {
            promotion.id(req.params.Id).remove();
            promotion.save()
            .then(promotion => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            })
            .catch(err => next(err));
    } else if (!promotion){
        err = new Error(`Promotion ${req.params.promotionId} not found`);
        err.status = 404;
        return next(err);
    } else {
            err = new Error(`Promotion ${req.params.Id} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});



module.exports = promotionRouter;