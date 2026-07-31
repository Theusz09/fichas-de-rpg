[README.md](https://github.com/user-attachments/files/30567674/README.md)
# dossiê ⟡ fichas de rpg

Um site simples, estático e gratuito para criar e guardar fichas de personagem de RPG — com atributos, vida/sanidade/sorte, inventário e um mural de imagens para a aparência do personagem.

Não precisa de servidor nem de banco de dados: tudo é salvo no **localStorage** do próprio navegador de quem estiver usando (ou seja, cada pessoa vê e edita só as fichas que criou no seu aparelho). Há também botões para exportar/importar `.json`, então dá pra fazer backup ou passar uma ficha de um computador para o outro.

## como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público), por exemplo `fichas-rpg`.
2. Suba estes 4 arquivos para a raiz do repositório:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. No repositório, vá em **Settings → Pages**.
4. Em "Build and deployment", escolha **Deploy from a branch**.
5. Em "Branch", selecione `main` (ou `master`) e a pasta `/root`, depois clique em **Save**.
6. Espere um ou dois minutos. O GitHub vai te dar um link parecido com:
   `https://seu-usuario.github.io/fichas-rpg/`
7. Pronto — esse link já é o site publicado.

## como usar

- **+ nova ficha**: cria uma ficha em branco e já deixa ela selecionada.
- **seletor no topo**: troca entre as fichas já criadas.
- **duplicar**: cria uma cópia da ficha atual (útil para NPCs parecidos ou variações de personagem).
- **excluir**: apaga a ficha atual (pede confirmação).
- **atributos**: use os botões `−` / `+` ou digite o número direto; o máximo é 15, e a barrinha de segmentos mostra o quanto falta.
- **vida / sanidade / inventário**: preencha o valor atual e o máximo; a barra e os quadradinhos de inventário se atualizam sozinhos.
- **aparência do personagem**: clique em "adicionar imagem" para colar fotos, artes ou referências visuais do personagem — elas aparecem como polaroids na ficha. Pode adicionar quantas quiser e remover clicando no × de cada uma.
- **exportar / importar .json**: exportar baixa um arquivo com todas as suas fichas (serve como backup); importar lê um arquivo desses e adiciona as fichas nele à sua lista atual.
- **imprimir / pdf**: abre a janela de impressão do navegador já com um layout limpo, para salvar a ficha como PDF ou imprimir em papel.

## um aviso sobre as imagens

As imagens ficam guardadas dentro do próprio localStorage do navegador (como texto codificado). Isso funciona bem para fotos leves, mas navegadores costumam limitar esse espaço a alguns megabytes por site — se você notar que as fichas pararam de salvar depois de adicionar muitas imagens grandes, tente usar fotos menores ou comprimidas, ou remova algumas imagens antigas.

## música ambiente

O site tem um botãozinho flutuante (canto inferior direito, com um disco girando) que toca uma música de fundo em loop. Por causa das regras de autoplay dos navegadores, ela nunca começa sozinha — precisa que a pessoa clique no botão pelo menos uma vez.

Para ativar:

1. Pegue seu arquivo de música (você precisa ter os direitos de uso dele).
2. Renomeie para `musica.mp3`.
3. Coloque dentro da pasta `assets/`, no repositório, substituindo o arquivo `assets/LEIA-ME.txt`.
4. O caminho final deve ficar `assets/musica.mp3` — é exatamente esse caminho que o `index.html` já está esperando.

Se preferir outro formato (`.ogg`, `.wav` etc.), é só trocar o nome do arquivo e ajustar essa linha no `index.html`:

```html
<audio id="bgMusic" src="assets/musica.mp3" loop preload="none"></audio>
```

O volume inicial já vem baixo (35%) para não assustar demais quem abrir o site com o som ligado. Para ajustar, mude o valor de `bgMusic.volume` no `script.js` (de 0 a 1).

A preferência de "música ligada/desligada" fica salva no navegador de cada visitante — se a pessoa tinha deixado tocando, ao voltar ao site (e assim que interagir com a página) a música retoma sozinha.

## personalizar

O visual (cores, fontes, bordas) está todo no `style.css`, comentado por seções. Os campos e atributos da ficha (nomes, ordem, valor máximo) estão no topo do `script.js`, nas constantes `ATTRS` e `ATTR_MAX` — dá pra ajustar sem mexer no resto do código.
