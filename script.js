Vue.filter('ucwords',
    function(valor) {
        return valor.charAt(0).toUpperCase() + valor.slice(1)
    })

Vue.component('my-app', {
    data() {
        return {
            time: new Time('América MG', 'assets/america_mg_60x60.png'),
            times: [],
            visao: 'tabela',
            timeCasa: null,
            timeFora: null
        }
    },
    template: `
    <div class="container">
      <titulo></titulo>
      <div class="row">
        <div class="col-md-12">
          <novo-jogo :times="times"> </novo-jogo>
        </div>
      </div>
      <br />
      <div class="row">        
        <div class="col-md-12" v-show="visao === 'tabela'">
          <tabela-clubes :times="times"></tabela-clubes>
        </div>
      </div>
    </div>
    `,
    methods: {
        showTabela() {
            this.visao = 'tabela'
        },
        showPlacar({ timeCasa, timeFora }) {
            this.timeCasa = timeCasa;
            this.timeFora = timeFora;
            this.visao = 'placar'
        }
    }
})

Vue.component('titulo', {
    template: `
  <div class="row ">
  <h3>Campeonato Brasileiro - Série A - 2018</h3>
  </div>
  `
})

Vue.component('tabela-clubes', {
    inject: ['timesColecao'],
    data() {
        return {
            busca: '',
            ordem: {
                colunas: ['pontos', 'gm', 'gs', 'saldo'],
                sort: ['desc', 'desc', 'asc', 'desc']
            },
            times: this.timesColecao
        }
    },
    template: `<div>  
  <input type="text" class="form-control" v-model="busca">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>Nome</th>
        <th v-for="(coluna, indice) in ordem.colunas">
          <a href="#" @click.prevent="ordenar(indice)">
            {{coluna | ucwords}}
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(time,indice) in timesFiltrados" :class="{'table-success': indice<6 }"
        :style="{'font-size': indice <6 ? '17px' : '15px'}">
        <td>{{indice+1}}</td>
        <td>        
          <clube :time="time" > </clube>
        </td>
        <td>{{time.pontos}}</td>
        <td>{{time.gm}}</td>
        <td>{{time.gs}}</td>
        <td>{{time.saldo}}</td>
      </tr>
    </tbody>
  </table>
  <clubes-libertadores :times="timesOrdenados"></clubes-libertadores>
  <clubes-rebaixados :times="timesOrdenados"></clubes-rebaixados>
  </div>
  `,
    computed: {
        timesFiltrados() {
            var self = this;
            return _.filter(this.timesOrdenados, function(time) {
                var busca = self.busca.toLowerCase();
                return time.nome.toLowerCase().indexOf(busca) >= 0;
            })
        },
        timesOrdenados() {
            return _.orderBy(this.times, this.ordem.colunas, this.ordem.sort)
        }
    },
    methods: {
        ordenar(indice) {
            this.$set(this.ordem.sort, indice, this.ordem.sort[indice] == 'desc' ? 'asc' : 'desc')
        }
    }
})

Vue.component('clubes-libertadores', {
    props: ['times'],
    template: `
<div>
  <h3>
    Times Classificados para Libertadores
  </h3>
    <ul>
      <li v-for="time in timesLibertadores">
        <clube :time="time"> </clube>
      </li>
    </ul>
</div>`,
    computed: {
        timesLibertadores() {
            return this.times.slice(0, 6);
        }
    }
})

Vue.component('clubes-rebaixados', {
    props: ['times'],
    template: `
<div>
  <h3>
  Times Rebaixados
  </h3>
    <ul>
      <li v-for="time in timesRebaixados">
        <clube :time="time"> </clube>
      </li>
    </ul>
</div>`,
    computed: {
        timesRebaixados() {
            return this.times.slice(16, 20)
        }
    }
})

Vue.component('clube', {
    props: ['time', 'invertido'],
    template: `
<div style="display: flex; flex-direction: row">
  <img :src="time.escudo" alt="" class="escudo"   :style="{order: invertido == 'true'? 2 : 1}">
  <span :style="{order: invertido == 'true'? 1 : 2}"> {{time.nome | ucwords}}</span>
</div>
`
});

Vue.component('novo-jogo', {

    template: `
    <div>
      <button class="btn btn-primary" @click="criarNovoJogo" > Novo Jogo </button>
      <placar-modal :time-casa="timeCasa" :time-fora="timeFora" ref="modal" ></placar-modal>
    </div>
  `,
    data() {
        return {
            times: this.timesColecao,
            timeCasa: null,
            timeFora: null,

        }
    },
    inject: ['timesColecao'],
    methods: {
        criarNovoJogo() {
            var indiceCasa = Math.floor(Math.random() * 20),
                indiceFora = Math.floor(Math.random() * 20);
            this.timeCasa = this.timesColecao[indiceCasa];
            this.timeFora = this.timesColecao[indiceFora];
            const { modal } = this.$refs
            modal.showModal();
        },
    }
})

Vue.component('placar', {
    props: ['timeCasa', 'timeFora'],
    data() {
        return {
            golsCasa: 0,
            golsFora: 0
        }
    },
    template: `
  <div>
    <form class="form-inline">      
    <input type="number" class="form-control" v-model="golsCasa">
      <clube :time="timeCasa" invertido="true" v-if="timeCasa"> </clube>      
    <span>X</span>
      <clube :time="timeFora" v-if="timeFora"> </clube>
    <input type="number" class="form-control" v-model="golsFora">
      <button type="button" class="btn btn-primary" @click="fimJogo">
        Fim de Jogo
      </button>
    </form>
  </div>
  `,
    methods: {
        fimJogo() {
            var golsMarcados = parseInt(this.golsCasa);
            var golsSofridos = parseInt(this.golsFora);
            this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos);
            this.$emit('fim-jogo');
        },
    }
})


Vue.component('placar-modal', {
    template: `
  <modal ref="modal" >    

    <h5 slot="header" class="modal-title">Novo Jogo</h5>   

      <form slot="body" class="form-inline">      
        <input type="number" class="form-control" v-model="golsCasa">
          <clube :time="timeCasa" invertido="true" v-if="timeCasa"> </clube>      
        <span>X</span>
          <clube :time="timeFora" v-if="timeFora"> </clube>
        <input type="number" class="form-control" v-model="golsFora">              
      </form> 

    <div slot="footer">      
      <button type="button" class="btn btn-primary" @click="fimJogo">
        Fim de Jogo
      </button>
    </div>

  </modal>
    `,
    data() {
        return {
            golsCasa: 0,
            golsFora: 0
        }
    },
    props: ['timeCasa', 'timeFora'],
    methods: {
        showModal() {
            this.getModal().show();
        },
        closeModal() {
            this.getModal().close();
        },
        getModal() {
            return this.$refs.modal;
        },
        fimJogo() {
            var golsMarcados = parseInt(this.golsCasa);
            var golsSofridos = parseInt(this.golsFora);
            this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos);
            this.closeModal();
            this.golsCasa = 0;
            this.golsFora = 0;
        },
    }
})


Vue.component('modal', {
    template: `
     <!-- Modal -->
      <div class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">           
            <div class="modal-header">
            <slot  name="header"> </slot>            
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
              <div class="modal-body">
              <slot name="body"> </slot>
              </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            <slot name="footer"> </slot>
          </div>

          </div>
        </div>
      </div>
    `,
    methods: {
        show() {
            $(this.$el).modal('show')
        },
        close() {
            $(this.$el).modal('hide')
        }

    }
})

new Vue({
    el: '#app',
    provide() {
        return {
            timesColecao: [
                new Time('palmeiras', 'assets/palmeiras_60x60.png'),
                new Time('Internacional', 'assets/internacional_60x60.png'),
                new Time('Flamengo', 'assets/flamengo_60x60.png'),
                new Time('Atlético-MG', 'assets/atletico_mg_60x60.png'),
                new Time('Santos', 'assets/santos_60x60.png'),
                new Time('Botafogo', 'assets/botafogo_60x60.png'),
                new Time('Atlético-PR', 'assets/atletico-pr_60x60.png'),
                new Time('Corinthians', 'assets/corinthians_60x60.png'),
                new Time('Grêmio', 'assets/gremio_60x60.png'),
                new Time('Fluminense', 'assets/fluminense_60x60.png'),
                new Time('Bahia', 'assets/bahia_60x60.png'),
                new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
                new Time('São Paulo', 'assets/sao_paulo_60x60.png'),
                new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
                new Time('Sport', 'assets/sport_60x60.png'),
                new Time('Ceará', 'assets/ceara_60x60.png'),
                new Time('Vitória', 'assets/vitoria_60x60.png'),
                new Time('Vasco', 'assets/vasco_60x60.png'),
                new Time('América-MG', 'assets/america_mg_60x60.png'),
                new Time('Paraná', 'assets/parana_60x60.png'),
            ],
            metodoPraPegarAlgumaCoisa() {

            },
            getAlgumaCoisa() {
                return this.$root.method1;
            },
            method1: this.method1
        }
    },
    //template: `<my-app> </my-app>`,
    data: {
        // times: [
        //     new Time('palmeiras', 'assets/palmeiras_60x60.png'),
        //     new Time('Internacional', 'assets/internacional_60x60.png'),
        //     new Time('Flamengo', 'assets/flamengo_60x60.png'),
        //     new Time('Atlético-MG', 'assets/atletico_mg_60x60.png'),
        //     new Time('Santos', 'assets/santos_60x60.png'),
        //     new Time('Botafogo', 'assets/botafogo_60x60.png'),
        //     new Time('Atlético-PR', 'assets/atletico-pr_60x60.png'),
        //     new Time('Corinthians', 'assets/corinthians_60x60.png'),
        //     new Time('Grêmio', 'assets/gremio_60x60.png'),
        //     new Time('Fluminense', 'assets/fluminense_60x60.png'),
        //     new Time('Bahia', 'assets/bahia_60x60.png'),
        //     new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
        //     new Time('São Paulo', 'assets/sao_paulo_60x60.png'),
        //     new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
        //     new Time('Sport', 'assets/sport_60x60.png'),
        //     new Time('Ceará', 'assets/ceara_60x60.png'),
        //     new Time('Vitória', 'assets/vitoria_60x60.png'),
        //     new Time('Vasco', 'assets/vasco_60x60.png'),
        //     new Time('América-MG', 'assets/america_mg_60x60.png'),
        //     new Time('Paraná', 'assets/parana_60x60.png'),
        // ],
    },
    methods: {
        method1() {
            console.log("olá");
        }
    },
    filters: {
        saldo(time) {
            return time.gm - time.gs;
        }
    }
})