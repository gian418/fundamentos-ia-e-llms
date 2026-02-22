# Duck Hunt JS – Passos detalhados para rodar no openSUSE (Node 22)

## 1. Instalar dependências do sistema

- **ffmpeg** (para processamento de áudio):
  ```sh
  sudo zypper install ffmpeg
  ```
- **TexturePacker** (para gerar sprites de imagens):
  - Baixe do site oficial ([link](https://www.codeandweb.com/texturepacker/download)) ou instale via Flatpak:
    ```sh
    flatpak install flathub com.codeandweb.texturepacker
    ```
  - Para rodar via Flatpak:
    ```sh
    flatpak run com.codeandweb.texturepacker
    ```
  - Na primeira execução, aceite a licença digitando `agree` no terminal.
  - O TexturePacker instalado via Flatpak não fica disponível no PATH global. Sempre use o comando `flatpak run com.codeandweb.texturepacker ...` para gerar spritesheets via terminal.

- **Dependências extras:**
  - Se aparecer erro de biblioteca ausente (ex: `libgthread-2.0.so.0`), instale o pacote sugerido pelo erro:
    ```sh
    sudo zypper install libglib-2_0-0
    ```

## 2. Instalar dependências do projeto Node.js

No diretório do projeto:
```sh
npm install
```

## 3. Corrigir bug do audiosprite.js

- Edite o arquivo `vendor/audiosprite.js`:
  - Troque `os.tmpDir()` por `os.tmpdir()` (letra "d" minúscula).
  - Isso corrige erro de TypeError ao rodar o gulp audio.

## 4. Gerar arquivos de áudio (audio.json, audio.mp3, audio.ogg)

```sh
npx gulp audio
```
- Se aparecer erro de ffmpeg não encontrado, verifique a instalação do ffmpeg.

## 5. Gerar sprites (sprites.json, sprites.png)

- Com TexturePacker via Flatpak:
  ```sh
  flatpak run com.codeandweb.texturepacker --disable-rotation --data dist/sprites.json --format json --sheet dist/sprites.png src/assets/images
  ```
- Se TexturePacker não estiver no PATH, sempre use o comando acima.
- O comando gera os arquivos necessários na pasta `dist/`.

## 6. Criar arquivo index.html em dist/

Crie o arquivo `dist/index.html` com o conteúdo:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Duck Hunt JS</title>
</head>
<body>
  <script src="duckhunt.js"></script>
</body>
</html>
```
- Esse arquivo é essencial para o webpack-dev-server exibir o jogo corretamente.

## 7. Rodar o servidor de desenvolvimento

```sh
npm start
```
- O comando inicia o webpack-dev-server e serve o conteúdo da pasta `dist/` em http://localhost:8080/.
- Abra o navegador e acesse http://localhost:8080/ para jogar.

---

### Observações e dicas

- **TexturePacker via Flatpak:**
  - Não tente rodar apenas `TexturePacker ...` no terminal, pois o Flatpak isola o executável. Sempre use `flatpak run com.codeandweb.texturepacker ...`.
  - Se quiser automatizar o gulpfile.js para rodar TexturePacker via Flatpak, altere o comando shell na task de imagens.

- **Erros comuns:**
  - Se aparecer apenas a listagem de arquivos no navegador, verifique se o arquivo `index.html` está na pasta `dist/`.
  - Se o jogo não carregar imagens ou sons, confira se os arquivos `sprites.json`, `sprites.png`, `audio.json`, `audio.mp3` e `audio.ogg` estão presentes em `dist/`.
  - Se faltar alguma biblioteca do sistema, instale conforme o erro informado pelo terminal.

- **Atualização de assets:**
  - Sempre que alterar imagens em `src/assets/images`, gere novamente os sprites com o comando do TexturePacker.
  - Sempre que alterar sons em `src/assets/sounds`, gere novamente os arquivos de áudio com `npx gulp audio`.

- **Node.js:**
  - O projeto foi testado com Node.js v22. Outras versões podem funcionar, mas podem exigir ajustes em dependências.

- **Documentação oficial:**
  - Consulte o README.md do projeto para mais detalhes sobre arquitetura e comandos.

---

Com esses passos, o Duck Hunt JS deve rodar corretamente no openSUSE!
