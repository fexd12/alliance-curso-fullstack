<template>
  <div>
    <b-table striped hover outlined responsive :items="ativos" :fields="fields"></b-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["value"],
  data() {
    return {
      content: {
        codigo_ativo: this.value.codigo_ativo,
        quantidade: Number(this.value.quantidade),
        preco: Number(this.value.preco),
        tipo: this.value.tipo,
        lucro_prejuizo: this.value.lucro_prejuizo
      },
      ativos: [],
      fields: [
        {
          key: "codigo_ativo",
          label: "Código"
        },
        {
          key: "quantidade",
          label: "Quantidade"
        },
        {
          key: "preco",
          label: "Preco"
        },
        {
          key: "tipo",
          label: "tipo"
        },
        {
          key: "lucro_prejuizo",
          label: "lucro_prejuizo"
        },
        {
          key:"data",
          label:"data"
        }
      ]
    };
  },
  methods: {
    handleInput() {
      let retorno = {
        codigo_ativo: this.value.codigo_ativo,
        quantidade: Number(this.value.quantidade),
        preco: Number(this.value.preco),
        tipo: this.value.tipo,
        data: this.value.data,
        lucro_prejuizo: this.value.lucro_prejuizo
      };
      this.$emit("input", retorno);
    },
    async historico() {
      this.ativos.splice(0, this.ativos.length);
      let dados = await axios.get(
        `http://localhost:3000/${this.value.codigo_ativo}`
      );
      this.ativos.push(...dados.data);
      //await this.carregaAtivos();
    }
  },
  async mounted() {
    await this.historico();
  }
};
</script>