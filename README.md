# Spotify Radio - Semana JS Expert 6.0

Seja bem vindo(a) à sexta Semana Javascript Expert. Este é o código inicial para iniciar nossa jornada.

Marque esse projeto com uma estrela 🌟

Acesse a [**comunidade exclusiva no discord**](https://bit.ly/semanajsexpert-discord) para tirar suas dúvidas e conhecer pessoas: 
## Preview

<img src="./prints/demo.png" />

## Checklist Features

- Web API
    - [ ] Deve atingir 100% de cobertura de código em testes
    - [ ] Deve ter testes end to end validando todas as rotas da API
    - [ ] Deve entregar arquivos estáticos com o Node.js Stream
    - [ ] Deve entregar arquivos de música com o Node.js Stream
    - [ ] Dado um usuário desconectado, não deve quebrar a API
    - [ ] Mesmo que vários comandos sejam disparados ao mesmo tempo, não deve quebrar a API
    - [ ] Caso aconteça um erro inesperado, a API deve continuar funcionando
    - [ ] O projeto precisa ser executado em ambientes Linux, Mac e Windows

- Web App 
    - Client
        - [ ] Deve reproduzir a transmissão
        - [ ] Não deve pausar se algum efeito for adicionado
    - Controller
        - [ ] Deve atingir 100% de cobertura de código em testes
        - [ ] Deve poder iniciar ou parar uma transmissão 
        - [ ] Deve enviar comandos para adicionar audio efeitos à uma transmissão

## Tarefas por aula

- Aula 01: Cobrir as camadas service e route com testes unitários e alcançar 100% de code coverage
- Aula 02: Manter 100% de code coverage e implementar testes e2e para toda a API
- Aula 03: implementar testes unitários para o frontend e manter 100% de code coverage
- **PLUS**: 
    - [ ] disponibilizar um novo efeito
        - [ ] adicionar um botão novo no controlador
        - [ ] adicionar um som de efeito novo para a pasta `audios/fx/`
        - [ ] republicar no heroku
## Código fonte das aulas e resolução de desafios
- [Aula01](./aulas/aula01/)
    - [desafio resolvido](./aulas/aula01-desafio-resolvido) e [página com code coverage em 100%](https://erickwendel.github.io/semana-javascript-expert06/aulas/aula01-desafio-resolvido/coverage/lcov-report/index.html)
- [Aula02](./aulas/aula02/)
### Considerações
- Tire suas dúvidas sobre os desafios em nossa comunidade, o objetivo é você aprender de forma divertida. Surgiu dúvidas? Pergunte por lá!

- Ao completar qualquer um dos desafios, envie no canal **#desafios** da comunidade no [**Discord**](https://bit.ly/semanajsexpert-discord)

### Créditos aos áudios usados

#### Transmissão 
- [English Conversation](https://youtu.be/ytmMipczEI8)

#### Efeitos
- [Applause](https://youtu.be/mMn_aYpzpG0)
- [Applause Audience](https://youtu.be/3IC76o_lhFw)
- [Boo](https://youtu.be/rYAQN11a2Dc)
- [Fart](https://youtu.be/4PnUfYhbDDM)
- [Laugh](https://youtu.be/TZ90IUrMNCo)
## FAQ 
- `NODE_OPTIONS` não é um comando reconhecido pelo sistema, o que fazer?
    - Se você estiver no Windows, a forma de criar variáveis de ambiente é diferente. Você deve usar a palavra `set` antes do comando. 
    - Ex: `    "test": "set NODE_OPTIONS=--experimental-vm-modules && npx jest --runInBand",`

- Rodei `npm test` mas nada acontece, o que fazer?
    - Verifique a versão do seu Node.js. Estamos usando na versão 17. Entre no [site do node.js](https://nodejs.org) e baixe a versão mais recente.

- `jest.spyOn` - quando tentamos usar o `function.name` (algo como `stream.pipe.name`), ele diz que a instancia é undefined
    - Neste caso, use o valor como string: `jest.spyOn(stream, "pipe").mockReturnValue`
- Desafio 01 impossível de completar 100% de code coverage pois o [testUtil.js](./aulas/aula01/tests/unit/_util/testUtil.js) não está sendo completamente usado
    -  Adicione na primeira linha do arquivo [testUtil.js](./aulas/aula01/tests/unit/_util/testUtil.js) o seguinte trecho de código: `/* istanbul ignore file */` . Isso fará com que o jest ignore esse arquivo e complete os 100%. 
    -  Importante: essa  alteração, servirá apenas para completar esse primeiro e/ou segundo desafio, na ultima aula, não vamos precisar ignorar esse arquivo uma vez que vamos usar todas as funções
