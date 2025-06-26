# nestjs-doc

Un module pour générer automatiquement la documentation de vos routes/microservices NestJS à partir de décorateurs personnalisés.

## Installation

```bash
npm install nestjs-doc
```

## Utilisation

### 1. Importer le module dans votre application

```typescript
import { DocModule } from "nestjs-doc";

@Module({
  imports: [DocModule],
})
export class AppModule {}
```

### 2. Utiliser le décorateur `@Doc` sur vos handlers

```typescript
import { Doc } from 'nestjs-doc';

export class MyDto {
  // ...
}

@Controller()
export class MyController {
  @MessagePattern({ cmd: 'my-action' })
  @Doc({
    summary: 'Résumé de l\'action',
    input: MyDto,
    output: "ok",
    description: 'Description détaillée de l'action',
  })
  myAction(data: MyDto): string {
    return 'ok';
  }
}
```

### 3. Génération automatique de la documentation

Au démarrage de l'application, un fichier `doc.json` sera généré à la racine du projet avec la documentation de tous les handlers décorés.

## API

### Décorateur `@Doc(options)`

- `summary` _(string, requis)_ : Résumé de l'action
- `pattern` _(string, optionnel)_ : Pattern du message (déduit automatiquement si absent)
- `input` _(any, optionnel)_ : Type d'entrée (DTO)
- `output` _(any, optionnel)_ : Type de sortie
- `description` _(string, optionnel)_ : Description détaillée

### Service `DocService`

Le service est automatiquement lancé au démarrage du module et génère le fichier de documentation.

## Contribution

Les contributions sont les bienvenues !

## Licence

MIT
