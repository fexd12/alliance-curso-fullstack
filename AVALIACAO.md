# Controle de Investimentos

## DICAS
LEIA TODO ESTE DOCUMENTO ANTES DE COMEÇAR A ESCREVER O CÓDIGO. TENHA CERTEZA DE QUE ENTENDEU O QUE PRECISA SER FEITA E TIRE DÚVIDAS COM O INSTRUTOR SOBRE O PROBLEMA.

TENTE FAZER FUNCIONALIDADES COMPLETAS, OU SEJA, É MELHOR TER UM BACKEND PRONTO COM SEU FRONTEND (ASSIM O USUÁRIO CONSEGUE FAZER ALGO), DO QUE TER VÁRIOS BACKEND E NENHUM FRONTEND (OU VÁRIOS FRONTEND SEM O BACKEND CORRESPONDENTE)

A AVALIÇÃO É LONGA E PODE NÃO SER POSSÍVEL FAZER TODAS AS FUNCIONALIDADES. TUDO BEM.

UTILIZE COMMIT PARCIAIS PARA SALVAR SEU TRABALHO, ASSIM SE VOCÊ QUEBRAR ALGO PODERÁ VOLTAR PARA O ÚLTIMO COMMIT

NO FIM **NÃO ESQUECE DE FAZER COMMIT E PUSH** PARA SALVAR SUA AVALIAÇÃO.

**!!! BOA AVALIAÇÃO !!!**

## Introdução
A bolsa de valores de São Paulo atingiu 115 mil pontos, máxima histórica, e nunca antes na história do país tantas pessoas físicas investiram em papéis de empresas ofertadas na bolsa.

Com o cenário de juros baixos, não há mais como a velha poupança ou mesmo investimentos atrelados ao CDI serem atrativos.

Com tantas pessoas investindo na bolsa, um aplicativo que ajude a controlar os investimentos pode ser muito útil.

## O sistema

Pensamos então em um simples sistema que permita ao usuário cadastrar seus ativos (ações que ele possuí) e ver quanto dinheiro ele está ganhando ou perdendo.

O conjunto de papéis que um pessoa tem em um determinado momento é chamado de Carteira.

O usuário precisa comprar e vender ativos e com isso sua carteira aumenta (novos ativos). É possível aumentar a quantidade de papéis que o usuário possui comprando mais de um mesmo ativo. Toda vez que se compra mais de um ativo, muda-se o preço médio.

O preço médio é quanto custou (em média) cada papel que o usuário possui. Por exemplo, vamos supor que ele compra 100 ações de um ativo por R$ 10,00 reais cada. O preço médio será R$ 10,00 por papel. Se ele, sem vender nenhuma ação deste ativo, comprar mais 100 ações por R$ 20,00 cada, então ele terá um total de 200 ações e o preço médio será R$ 15,00 por ação (média ponderada).

O usuário realiza operações de compra e venda. No caso das operações de venda, elas poderão gerar um lucro ou um prejuízo. Se ele vender acima do preço médio então teve lucro, se vender abaixo, teve prejuízo.

## Modelo de dados

Para facilitar o desenvolvimento. Um analista de sistemas já montou o modelo de banco de dados que a aplicação vai usar. Veja a seguir:

```sql
create table ATIVOS (
    CODIGO          character(6) not null,
    DESCRICAO       character(60) not null,
    primary key (CODIGO)
);

create table CARTEIRA (
    CODIGO_ATIVO    character(6) not null,
    QUANTIDADE      numeric(10) not null,
    PRECO_MEDIO     numeric(12, 4) not null,
    primary key (CODIGO_ATIVO),
    constraint FK_CARTEIRA_ATIVO foreign key (CODIGO_ATIVO) references ATIVOS(CODIGO)
);

create table OPERACOES (
    ID              numeric(10) not null,    /* Utilize a sequencia SEQ_OPERACOES_ID para gerar as chaves desta tabela (auto incremento) */
    CODIGO_ATIVO    character(6) not null,/* O papel (ativo) que foi transacionado */
    TIPO            char(1) not null,       /* Utilize 'V' para venda e 'C' para compra */
    DATA            timestamp default NOW() not null, /* Infome a data da operação */
    PRECO           numeric(12,2) not null, /* Informe o preço por ação da operação */
    QUANTIDADE      numeric(10) not null,   /* Quantidade que foi vendida ou comprada */
    LUCRO_PREJUIZO  numeric(12,2) null,     /* Lucro ou Prejuízo da operação. Só preencher quando for uma operação do tipo VENDA (TIPO = 'V'), caso contrário gravar NULL */
    primary key (ID),
    constraint FK_OPERACAO_ATIVO foreign key (CODIGO_ATIVO) references ATIVOS(CODIGO)
)

create sequence SEQ_OPERACOES_ID
    start 1
    increment 1;

```

Para criar os objetos do banco de dados execute cada um deles na ferramenta  "Query Tool" do pgAdmin.

## Backend

O backend da aplicação deve oferecer serviços para manipular os registros de banco de dados.

Nosso analista acredita que as seguintes rotas são essenciais:

- /ativos
  - GET '/'
    - Retornar uma lista com os registros da tabela ATIVOS

  - POST '/'
    - Receber um objeto com estes atributos ```{codigo, descricao}```
    - Retornar 201 se tudo der certo

  - PUT '/:codigo'
    - Receber na rota o código do ativo
    - Receber no corpo (body) da requisição um objeto com estes atributos ```{descricao}```
    - Retornar 204 se tudo der certo

  - DELETE '/:codigo'
    - Receber na rota o código do ativo
    - Retornar 204 se tudo der certo

- /carteira (verbos GET, POST e PUT)
  - GET '/'
    - Retornar uma lista com os registros da tabela CARTEIRA

  - POST '/' (só deve ser chamado no caso da primeira compra de um ativo)
    - Receber um objeto com estes atributos ```{codigo, quantidade, preco}```

    - Quando for chamado, deverá:

      - Gravar uma linha na tabela CARTEIRA, onde:
        - CODIGO_ATIVO = codigo
        - QUANTIDADE = quantidade
        - PRECO_MEDIO = preco

      - Gravar uma linha na tabela OPERACOES, onde:
        - ID = nextval('SEQ_OPERACOES_ID')
        - CODIGO_ATIVO = codigo
        - QUANTIDADE = quantidade
        - PRECO = preco
        - TIPO = 'C'
        - DATA (não colocar no comando INSERT)
        - LUCRO_PREJUIZO (não colocar no comando INSERT)
    - Retornar 201 se der tudo certo

  - PUT ('/:codigo')
    - Receber na rota o código do ativo
    - Receber no corpo (body) da requisição um objeto com estes atributos ```{codigo, tipo, quantidade, preco}```

    - Se tipo for **venda**, então:
      - Realizar um INSERT na tabela OPERACOES, onde:
        - ID = nextval('SEQ_OPERACOES_ID')
        - CODIGO_ATIVO = codigo
        - QUANTIDADE = quantidade
        - PRECO = preco
        - TIPO = 'V'
        - DATA (não colocar no comando INSERT)
        - LUCRO_PREJUIZO = (preco - CARTEIRA.PRECO_MEDIO) * quantidade **!! IMPORTANTE !!** você terá que de alguma forma ter o valor da CARTEIRA.PRECO_MEDIO, existem várias formas de resolver este problema, pense em como obter este valor (**bônus**). No entanto, se estiver com dificuldades grave 0 (ZERO) neste campo.

      - Realizar um UPDATE na tabela CARTEIRA na linha do codigo correspondente, definindo:
        - QUANTIDADE = QUANTIDADE - quantidade

      - Retornar 201 se der tudo certo

    - Se tipo for *compra*, então:
      - Realizar um INSERT na tabela OPERACOES, onde:
        - ID = nextval('SEQ_OPERACOES_ID')
        - CODIGO_ATIVO = codigo
        - QUANTIDADE = quantidade
        - PRECO = preco
        - TIPO = 'C'
        - DATA (não colocar no comando INSERT)
        - LUCRO_PREJUIZO (não colocar no comando INSERT)

      - Realizar um UPDATE na tabela CARTEIRA na linha do codigo correspondente, definindo:
        - QUANTIDADE = QUANTIDADE + quantidade
        - PRECO_MEDIO = ((QUANTIDADE * PRECO_MEDIO) + (quantidade * preco)) / (QUANTIDADE + quantidade)

      - Retornar 201 se der tudo certo

  - GET (':codigo/operacoes') **BÔNUS**
    - Receber na rota o código do ativo
    - Retornar as linhas da tabela operações onde (WHERE) o CODIGO_ATIVO = codigo

- /performance **BÔNUS**
  - GET ('/')
    - Retornar TODAS as linhas da tabela operações onde (WHERE) TIPO = 'V'


## Frontend
  Tela Home, com um menu superior de navegação para as seguintes telas:

  - Ativos (para cadastrar, editar e excluir registros da tabela ATIVOS)

  - Carteira (para visualizar a carteira e comprar e vender ações)

  - Performance (um relatório para ver o quanto o usuário está ganhando ou perdendo)

### Tela Ativos
  - Exibir uma tabela com os ativos cadastrados

  - Ter um botão "Adicionar" para que o usuário consiga criar um novo Ativo

  - Ter um botão "Editar" para cada ativo para que o usuário possa alterar um Ativo existente

  - Ter um botão "Excluir" para cada ativo para que o usuário possa excluir um Ativo existente

### Tela Carteira
  - Exibir uma tabela com os dados da carteira

  - Ter um botão "Adicionar" para que o usuário consiga colocar (comprar) um ativo que ele ainda não tenha em carteira. Ao adicionar, deve ser solicitada ao usuário as seguintes informações: código do ativo, quantidade e preço.

  - Ter um botão "Comprar mais" para cada ativo em carteira (na tabela) para que o usuário possa comprar mais ações de um ativo. Ao clicar o usuário deverá informar a quantidade e o preço da compra. O código do ativo pode até aparecer na janela (modal) de "Comprar mais", mas jamais poderá estar habilitado para edição.

  - Ter um botão "Vender" para cada ativo em carteira (na tabela) para que o usuário possa vender mais ações de um ativo. Ao clicar o usuário deverá informar a quantidade e o preço da venda. O código do ativo pode até aparecer na janela (modal) de "Comprar mais", mas jamais poderá estar habilitado para edição.

  - **BÔNUS** Ter um botão "Histórico" para cada ativo em carteira (na tabela) para que o usuário consiga vizualizar as operações realizadas com o Ativo. Deverá mostrar uma lista (tabela) com os seguintes valores: Tipo (Compra ou Venda), Data, Quantidade, Preço

### Tela Performance
  - Exibir uma tabela com a performance das operações

  - Os seguintes campos devem ser exibidos: Código do Ativo, Data, Quantidade Vendida, Lucro/Prejuízo (valores positivos são lucro e negativos são prejuízo)

  - **BÔNUS** Exibir em algum lugar da tela o resultado acumulado (soma do campo LUCRO_PREJUÍZO)

  - **BÔNUS** Exibir os valores positivos com letra verde e os negativos em vermelho (inclusive no total acumulado)