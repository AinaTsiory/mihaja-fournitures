# Mihaja Fournitures – site vitrine

## Lancer le site
Placez les fichiers selon l'arborescence (`index.html`, `css/style.css`, `js/script.js`, `assets/`) puis ouvrez `index.html` dans un navigateur moderne. Aucune installation requise.
Internet n'est nécessaire que pour WhatsApp et Facebook. Le site n'utilise aucune ressource distante (icônes SVG intégrées).

## Modifier les produits et prix
Dans `js/script.js`, tableau `PRODUCTS` : `price` en Ariary (nombre entier) ou `null` (= sur demande, jamais ajouté au panier).

## Remplacer les images
Les visuels sont des icônes SVG. Pour des photos : déposez-les dans `assets/images/`, ajoutez `image: 'assets/images/agrafeuse.jpg'` au produit, puis remplacez le `<svg>` de `.thumb` dans `renderProducts()` par `<img src loading="lazy" width="400" height="300" alt="…">` avec `onerror` géré en JS (`addEventListener('error')`) pour afficher l'icône de secours.

## Modifier les contacts
Numéro : constante `WHATSAPP_NUMBER` (JS, format 261XXXXXXXXX) et liens `wa.me` dans `index.html`. Facebook : liens dans la section Contact et le pied de page.

## Tester
- **Promotion** : ajouter une agrafeuse seule (pas d'offre), puis une désagrafeuse (message vert), puis retirer l'une (l'offre disparaît).
- **WhatsApp** : ouvrir le panier > « Valider via WhatsApp » : le message prérempli doit lister articles, quantités, total, promotion si active. Panier vide : message d'erreur.
- **Persistance** : actualiser la page, le panier est restauré.
