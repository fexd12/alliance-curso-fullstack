<template>
  <div class="ativos">
    <h1>Carteira</h1>
    <hr />

    <b-button v-b-modal.criaAtivos>
      <font-awesome-icon icon="plus" />
      <span>Adicionar</span>
    </b-button>

    <b-table striped hover :items="ativos" :fields="fields">
      <template slot="cell(actionCompraMais)" slot-scope="{ item }">
        <b-button v-on:click="beforeCompraMais(item)">
          <font-awesome-icon icon="pen" />
        </b-button>
      </template>

      <template slot="cell(actionVendeMais)" slot-scope="{ item }">
        <b-button v-on:click="beforeVendaMais(item)">
          <font-awesome-icon icon="pen" />
        </b-button>
      </template>
      <template slot="cell(actionHistorico)" slot-scope="{ item }">
        <b-button v-on:click="Beforehistorico(item)">
          <font-awesome-icon icon="pen" />
        </b-button>
      </template>
    </b-table>

    <b-modal
      id="criaAtivos"
      title="Novo Ativo"
      ok-title="Salvar"
      cancel-title="Cancelar"
      @show="beforeNovoAtivo"
      @ok="saveNovoAtivo"
    >
      <formCarteiras v-model="ativoAtual" />
    </b-modal>

    <b-modal
      id="compraMais"
      :title="'Editar ativo - ' + ativoAtual.codigo_ativo"
      ok-title="Alterar"
      cancel-title="Cancelar"
      @ok="compraMais"
    >
      <formCarteiras v-model="ativoAtual" />
    </b-modal>

    <b-modal
      id="vendaMais"
      :title="'Editar ativo - ' + ativoAtual.codigo_ativo"
      ok-title="Alterar"
      cancel-title="Cancelar"
      @ok="VendaMais"
    >
      <formCarteiras v-model="ativoAtual" />
    </b-modal>

    <b-modal
      id="historico"
      :title="'historico ativo - ' + ativoAtual.codigo_ativo"
      ok-title="voltar"
      cancel-title="Cancelar"
      @show="historico"
    >
      <formOperacoes v-model="ativoAtual" />
    </b-modal>
  </div>
</template>
<script>
import formCarteiras from "../components/FormCarteiras";
import formOperacoes from "../components/FormOperacoes";
import axios from "axios";

export default {
  components: { formCarteiras, formOperacoes },
  data: () => {
    return {
      ativoAtual: {
        codigo_ativo: "",
        quantidade: "",
        preco_medio: "",
        isNew: true
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
          key: "preco_medio",
          label: "Preco Medio"
        },
        {
          key: "actionCompraMais",
          label: "Compra Mais"
        },
        {
          key: "actionVendeMais",
          label: "Vende Mais"
        },
        {
          key: "actionHistorico",
          label: "Historico"
        }
      ]
    };
  },
  methods: {
    beforeCompraMais(ativo) {
      this.ativoAtual = {
        codigo_ativo: ativo.codigo_ativo,
        quantidade: ativo.quantidade,
        preco_medio: ativo.preco_medio,
        isNew: false
      };
      this.$root.$emit("bv::show::modal", "compraMais");
    },
    async compraMais() {
      let payload = {
        codigo_ativo: this.ativoAtual.codigo_ativo,
        quantidade: this.ativoAtual.quantidade,
        preco_medio: this.ativoAtual.preco_medio,
        tipo: "C"
      };

      try {
        await axios.put(
          `http://localhost:3000/carteira/${this.ativoAtual.codigo_ativo}`,
          payload
        );
        await this.carregaAtivos();
      } catch (err) {
        alert("erro ao atualizar ativo");
      }
    },
    Beforehistorico(ativo) {
      this.ativoAtual = {
        codigo_ativo: ativo.codigo_ativo
      };
      this.$root.$emit("bv::show::modal", "historico");
    },
    beforeVendaMais(ativo) {
      this.ativoAtual = {
        codigo_ativo: ativo.codigo_ativo,
        quantidade: ativo.quantidade,
        preco_medio: ativo.preco_medio,
        isNew: false
      };
      this.$root.$emit("bv::show::modal", "vendaMais");
    },
    async VendaMais() {
      let payload = {
        codigo_ativo: this.ativoAtual.codigo_ativo,
        quantidade: this.ativoAtual.quantidade,
        preco_medio: this.ativoAtual.preco_medio,
        tipo: "V"
      };

      try {
        await axios.put(
          `http://localhost:3000/carteira/${this.ativoAtual.codigo_ativo}`,
          payload
        );
        await this.carregaAtivos();
      } catch (err) {
        alert("erro ao atualizar ativo");
      }
    },
    async carregaAtivos() {
      this.ativos.splice(0, this.ativos.length);
      let dados = await axios.get("http://localhost:3000/carteira/");
      this.ativos.push(...dados.data);
    },

    beforeNovoAtivo() {
      this.ativoAtual.codigo_ativo = "";
      this.ativoAtual.quantidade = "";
      this.ativoAtual.preco_medio = "";
      this.ativoAtual.isNew = true;
    },

    async saveNovoAtivo() {
      let payload = {
        codigo_ativo: this.ativoAtual.codigo_ativo,
        quantidade: this.ativoAtual.quantidade,
        preco_medio: this.ativoAtual.preco_medio
      };
      try {
        await axios.post("http://localhost:3000/carteira/", payload);
        await this.carregaAtivos();
      } catch (err) {
        alert("erro ao inserir ativo");
      }
    }
  },
  async mounted() {
    await this.carregaAtivos();
  }
};
</script>