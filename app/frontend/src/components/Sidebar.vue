<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      @click="isOpen = false"
      class="
        fixed
        z-20
        inset-0
        bg-black
        opacity-50
        transition-opacity
        lg:hidden
      "
    ></div>
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="
        fixed
        z-30
        inset-y-0
        left-0
        w-64
        transition
        duration-300
        transform
        bg-gray-900
        overflow-y-auto
        lg:translate-x-0
        lg:static
        lg:inset-0
        rounded-r-lg
        lg:rounded-none
      "
    >
      <div class="flex items-center justify-center mt-8">
        <router-link to="/">
          <div
            class="
              flex
              justify-center
              items-center
              transition
              duration-500
              ease-in-out
              transform
              hover:-translate-y-1
              hover:scale-110
            "
          >
            <img class="h-32 w-32" src="https://system-photos.s3.sa-east-1.amazonaws.com/iStones-Logo.svg" alt="iStones" />
          </div>
        </router-link>
      </div>

      <!-- Home -->
      <nav class="mt-4">
        <div class="px-6" v-if="$route.name === 'ProductSearch'">
          <div class="text-gray-500 mb-2">
            <span class="h-5 w-5">
              <i class="fas fa-sliders-h"></i>
            </span>
            <span class="mx-4"> Filtros de pesquisa </span>
          </div>
          <form>
            <label class="text-gray-500 mb-1">Preço</label>
            <div class="flex">
              <input
                type="number"
                v-model="filters.min_price"
                class="
                  my-2
                  py-1
                  px-2
                  w-1/2
                  mr-1
                  rounded-md
                  bg-gray-700
                  text-gray-500
                "
                placeholder="Min"
              />
              <input
                type="number"
                v-model="filters.max_price"
                class="
                  my-2
                  py-1
                  px-2
                  w-1/2
                  ml-1
                  rounded-md
                  bg-gray-700
                  text-gray-500
                "
                placeholder="Máx"
              />
            </div>
            <label class="text-gray-500 mb-1">Qualidade</label>
            <div class="flex">
              <input
                v-model="filters.min_quality"
                class="
                  my-2
                  py-1
                  px-2
                  w-1/2
                  mr-1
                  rounded-md
                  bg-gray-700
                  text-gray-500
                "
                type="text"
                placeholder="Min"
              />
              <input
                v-model="filters.max_quality"
                class="
                  my-2
                  py-1
                  px-2
                  w-1/2
                  ml-1
                  rounded-md
                  bg-gray-700
                  text-gray-500
                "
                type="text"
                placeholder="Máx"
              />
            </div>
            <label class="text-gray-500 mb-1">CEP</label>
            <div class="flex mb-2">
              <input
                type="string"
                v-model="filters.cep"
                maxlength="9"
                class="
                  my-2
                  py-1
                  px-2
                  w-full
                  mr-1
                  rounded-md
                  bg-gray-700
                  text-gray-500
                "
                placeholder="CEP"
              />
            </div>
            <button
              type="button"
              @click="filterSearch()"
              class="
                transition
                duration-150
                py-1
                px-2
                bg-red-800
                hover:bg-red-800
                text-white
                font-bold
                border-b-4 border-red-800
                focus:outline-none
                rounded
                w-full
              "
            >
              Aplicar
            </button>
          </form>
        </div>
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Home' ? activeClass : inactiveClass]"
          to="/"
        >
          <span class="h-5 w-5">
            <i class="fas fa-home"></i>
          </span>
          <span class="mx-4"> Início </span>
        </router-link>

        <!-- Painel de controle -->
        <router-link
          v-if="
            $store.state.user.user.type == 'V' ||
            $store.state.user.user.type == 'A'
          "
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <span class="h-5 w-5">
            <i class="fas fa-tachometer-alt"></i>
          </span>
          <span class="mx-4"> Painel de controle </span>
        </router-link>

        <!-- Perfil -->
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Profile' ? activeClass : inactiveClass]"
          to="/perfil"
        >
          <span class="h-5 w-5">
            <i class="fas fa-address-card"></i>
          </span>
          <span class="mx-4"> Perfil </span>
        </router-link>

        <!-- Compras -->
        <router-link
          v-if="$store.state.user.user.type == 'C'"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Orders' ? activeClass : inactiveClass]"
          to="/suas-compras"
        >
          <span class="h-5 w-5">
            <i class="fas fa-shopping-basket"></i>
          </span>
          <span class="mx-4"> Compras </span>
        </router-link>

        <!-- Vendas -->
        <div
          v-if="$store.state.user.user.type == 'V'"
          class="
            flex
            cursor-pointer
            items-center
            duration-200
            mt-4
            py-2
            px-6
            border-l-4
          "
          :class="[$route.name === 'Orders' ? activeClass : inactiveClass]"
          @click="toggleSaleOptions()"
        >
          <span class="h-5 w-5">
            <i class="fas fa-money-check-alt"></i>
          </span>
          <span class="mx-4"> Vendas </span>
          <span v-if="saleOptions"><i class="fas fa-angle-up"></i></span>
          <span v-else
            ><i
              class="fas fa-angle-down"
              :class="[saleOptions ? 'fa-angle-up' : 'fa-angle-down']"
            ></i
          ></span>
        </div>

        <div v-show="saleOptions" class="ml-4 transition-all">
          <router-link
            class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
            :class="[
              $route.name === 'SalesPending' ? activeClass : inactiveClass,
            ]"
            to="/suas-vendas/pendentes"
          >
            <span class="h-5 w-5">
              <i class="fas fa-dolly"></i>
            </span>
            <span class="mx-4"> Pendentes </span>
          </router-link>

          <router-link
            class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
            :class="[
              $route.name === 'SalesShipped' ? activeClass : inactiveClass,
            ]"
            to="/suas-vendas/enviadas"
          >
            <span class="h-5 w-5">
              <i class="fas fa-truck-moving"></i>
            </span>
            <span class="mx-4"> Enviadas </span>
          </router-link>

          <router-link
            class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
            :class="[
              $route.name === 'SalesDelivered' ? activeClass : inactiveClass,
            ]"
            to="/suas-vendas/recebidas"
          >
            <span class="h-5 w-5">
              <i class="fas fa-check"></i>
            </span>
            <span class="mx-4"> Concluídas </span>
          </router-link>
        </div>

        <!-- Avaliações
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Avaliation' ? activeClass : inactiveClass]"
          to="/perfil"
        >
          <span class="h-5 w-5">
            <i class="fas fa-quote-right"></i>
          </span>
          <span class="mx-4"> Suas avaliações </span>
        </router-link> -->

        <!-- Mensagens -->
        <router-link
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[
            $route.name === 'HubMessage' ? activeClass : inactiveClass,
            this.newMessage ? 'animate-pulse bg-red-800' : undefined,
          ]"
          to="/central-mensagens"
        >
          <span class="h-5 w-5">
            <i class="fas fa-comment-dots"></i>
          </span>
          <span class="mx-4"> Central de Mensagens </span>
        </router-link>

        <router-link
          v-if="$store.state.user.user.type == 'V'"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[
            $route.name === 'ProductRegistration' ? activeClass : inactiveClass,
          ]"
          to="/produto/cadastrar"
        >
          <span class="h-5 w-5">
            <i class="fas fa-plus"></i>
          </span>
          <span class="mx-4"> Cadastrar Produto </span>
        </router-link>

        <router-link
          v-if="$store.state.user.user.type == 'V'"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Products' ? activeClass : inactiveClass]"
          to="/seus-produtos/"
        >
          <span class="h-5 w-5">
            <i class="fas fa-truck"></i>
          </span>
          <span class="mx-4"> Meus Produtos </span>
        </router-link>

        <router-link
          v-if="$store.state.user.user.type == 'A'"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Users' ? activeClass : inactiveClass]"
          to="/usuarios/"
        >
          <span class="h-5 w-5">
            <i class="fas fa-user"></i>
          </span>
          <span class="mx-4"> Usuários </span>
        </router-link>

        <router-link
          v-if="$store.state.user.user.type == 'A'"
          class="flex items-center duration-200 mt-4 py-2 px-6 border-l-4"
          :class="[$route.name === 'Message' ? activeClass : inactiveClass]"
          to="/mensagem/"
        >
          <span class="h-5 w-5">
            <i class="fas fa-envelope"></i>
          </span>
          <span class="mx-4"> Enviar mensagem </span>
        </router-link>
      </nav>
    </div>
    <MessageCardFixed :type="type" :title="title" :message="message" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";
import MessageCardFixed from "../components/MessageCardFixed.vue";
import { mapActions, mapMutations } from "vuex";
import genericMask from "../utils/genericMask";
import Chat from "../services/Chat";

export default defineComponent({
  setup() {
    const { isOpen } = useSidebar();
    const activeClass = ref(
      "bg-gray-600 bg-opacity-25 text-gray-100 border-red-800"
    );
    const inactiveClass = ref(
      "border-gray-800 text-gray-500 hover:bg-gray-600 hover:border-gray-600 hover:bg-opacity-25 hover:text-gray-100"
    );

    return {
      isOpen,
      activeClass,
      inactiveClass,
    };
  },
  data() {
    return {
      filters: {
        min_price: "",
        max_price: "",
        min_quality: "",
        max_quality: "",
        cep: "",
      },
      type: "none",
      message: "",
      title: "",
      saleOptions: false,

      newMessage: false,
    };
  },
  watch: {
    "filters.cep"(newCep) {
      //console.log(newCep);
      if (newCep.length == 8 && newCep.indexOf("-") == -1)
        this.filters.cep = genericMask(newCep, "#####-###");
    },
    "$route.name"(newName) {
      if (newName == "HubMessage") this.newMessage = false;
    },
  },
  sockets: {
    newMessage(data) {
      //console.log(data)
      if(data.message.posted_by == this.$store.state.user.user.id_user || this.$route.name == 'HubMessage') return
      this.newMessage = true;
    },
    newRoom(data) {
      this.$socket.client.emit("subscribe", [data.id_room]);
    },
  },
  methods: {
    ...mapMutations(["setSearch, setFilters, resetSearch"]),
    ...mapActions(["search"]),
    async filterSearch() {
      let data = {};
      const localFilters = this.filters;
      Object.keys(localFilters).map(function (key, index) {
        localFilters[key] != "" ? (data[key] = localFilters[key]) : undefined;
      });

      await this.search(data);
      this.message = "Filtros Aplicados!";
      this.title = "Sucesso!";
      this.type = "success";

      setTimeout(() => {
        this.type = "none";
      }, 3000);
    },

    toggleSaleOptions() {
      this.saleOptions = !this.saleOptions;
    },
  },
  async created() {
    if (this.$store.state.login.login.isLogged) {
      const chats = await Chat.getChatRooms(
        this.$store.state.user.user.id_user
      );
    
      this.$socket.client.emit("identify", this.$store.state.user.user.id_user);
      let rooms = [];

      console.log(chats.conversations)

      chats.conversations.map((room) => {
        rooms.push(room.id_room);
      });

      for(let c of chats.conversations){
        if(!c.read) {
          this.newMessage = true
          break;
        }
      }

      if (!chats.conversations.length) return;
      const res = this.$socket.client.emit("subscribe", rooms);
    }
  },
  components: {
    MessageCardFixed,
  },
});
</script>
<style>
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>