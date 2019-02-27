const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({ ad: purchaseAd.id, content, buyer: req.userId })

    return res.json(purchase)
  }

  async update (req, res) {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
