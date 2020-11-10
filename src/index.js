const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
var cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();
app.use(bodyParser.json())

app.use(cors());
app.options('/api/produits', cors());
function createError(message) {
  return {
    errors: [
      {
        message
      }
    ]
  }
};
let produits = [];
app.get('/', (req, res) => {
  res.send({
    status: 'online'
  })
});
app.post(
  '/api/produits', 
  [
    body('id').isString(),
    body('nom').isString(),
    body('prix_unitaire').isInt(),
    body('quantite').isInt()
  ],
  (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(
        createError('WAelwwww')
      )
  }
  const { id,nom, prix_unitaire,quantite } = req.body;

  const produit = {
    id,
    nom,
    prix_unitaire,
    quantite
  }
  console.log(produit)
  produits.push(produit);
  res.status(201).send(produit);
});
app.delete('/api/produits/', (req, res) => {
  produits=[]
  res.send({
    'message': `tous le produits has been successfully deleted`
  })
})
app.get('/api/produits', (req, res) => {
  res.send(produits.reverse());
})
app.get('/api/produits/produit/:id', (req, res) => {
  const id = req.params.id;
   const produit = _.find(produits,(produit) => produit.id === id);
   if(!produit) {
      return res.status(400).send(
       createError('produit not found')
     )
   }
   console.log("produit :"+JSON.stringify(produit))
   res.send(produit);
 })
app.get('/api/produits/:nom', (req, res) => {
 const nom = req.params.nom;
  const produit = _.filter(produits,(produit) => produit.nom === nom);
  if(!produit) {
     return res.status(400).send(
      createError('produit not found')
    )
  }
  console.log("produit :"+JSON.stringify(produit))
  res.send(produit);
})
app.put(
  '/api/produits/:id',
  [
    body('id').isString(),
    body('nom').isString(),
    body('prix_unitaire').isInt(),
    body('quantite').isInt()
  ],
  (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const { id,nom, prix_unitaire,quantite } = req.body;
  const updatedproduit = {
    id,
    nom,
    prix_unitaire,
    quantite
  }
  // Retrieve the index of the produit using its id
  const index = _.findIndex(produits, (produit) => produit.id === updatedproduit.id);
  if(index === -1) {
    return res.status(400).send(
      createError('produit not found')
    )
  }
  produits[index] = updatedproduit;
  res.send(updatedproduit);
});

app.delete('/api/produits/:id', (req, res) => {
  const id = req.params.id;
  const index = _.findIndex(produits, (produit) => produit.id === id);
  console.log(index);
  if(index === -1) {
     return res.status(400).send(
      createError('produit not found')
    )
  }
console.log(produits);
produits.splice(index, 1);
console.log(produits); 
  //produits = produits.splice(index, 1);
  res.send({
    'message': `produit has been successfully deleted`
  })
})
app.all('*', (req, res) => {
  return res.status(404).send(
     createError('Not found')
  )
})
app.listen(3000, () => {
  console.log("Listening to port 3000");
});