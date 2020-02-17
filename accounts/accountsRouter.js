const router = require('express').Router();

const db = require('../data/dbConfig.js');

router.get('/', (req, res) => {
  db('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'unable to get the list of accounts' });
    });
});

router.get('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .first()
    .then(account => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: 'unable to find the account' });
      }
    });
});

router.post('/', (req, res) => {
  if (accountIsValid(req.body)) {
    db('accounts')
      .insert(req.body, 'id')
      .then(([id]) => id)
      .then(id => {
        db('accounts')
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch(() => {
        res.status(500).json({ message: 'unable to add this account' });
      });
  } else {
    res.status(400).json({
      message: 'please provide a name and budget for this account',
    });
  }
});

router.put('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: 'unable to find account' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'unable to update this account' });
    });
});

router.delete('/:id', (req, res) => {
  db('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) deleted` });
    })
    .catch(() => {
      res.status(500).json({ message: 'unable to remove this account' });
    });
});

function accountIsValid({ name, budget }) {
  return name && typeof budget === 'number' && budget >= 0;
}

module.exports = router;