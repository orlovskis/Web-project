<template>
  <div
    class="
      flex
      justify-center
      items-center
      sm:h-full
      md:h-screen
      bg-gray-900
      px-6
    "
  >
    <div class="p-6 max-w-2xl w-full bg-white shadow-md rounded-md my-10">
      <div class="flex justify-center items-center mb-10">
        <img
          class="h-32 w-32"
          src="https://system-photos.s3.sa-east-1.amazonaws.com/iStones-Logo.svg"
          alt="iStones"
        />
      </div>
      <form class="mt-4" @submit.prevent="register">
        <div v-show="firstStep">
          <div class="flex-none md:flex md:space-x-4 md:my-4">
            <div class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="name"
              >
                Nome do Proprietário
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: João"
                required
                v-model="name"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="surname"
              >
                Sobrenome do Proprietário
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                placeholder="Ex: Silva"
                required
                v-model="surname"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
          </div>
          <div class="flex-none md:flex md:space-x-4 md:my-4">
            <div class="w-full md:w-1/3 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="birthdate"
              >
                Nascimento ou fundação
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                required
                v-model="birthdate"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div class="w-full md:w-1/3 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="tel"
              >
                Telefone
              </label>
              <input
                id="tel"
                name="tel"
                type="text"
                maxlength="15"
                minlength="14"
                placeholder="(XX) XXXXX-XXXX"
                @keyup="telMasc"
                required
                v-model="tel"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div class="w-full md:w-1/3 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="birthdate"
              >
                Eu sou
              </label>
              <select
                id="type"
                v-model="selected"
                name="type"
                required
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              >
                <option value="client" selected>Cliente</option>
                <option value="salesman">Vendedor</option>
              </select>
            </div>
          </div>
        </div>
        <div v-show="!firstStep">
          <div class="my-4">
            <label
              class="block text-gray-600 text-sm font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              :required="!firstStep"
              v-model="email"
              class="
                text-sm
                sm:text-sm
                w-full
                border
                rounded
                text-gray-800
                placeholder-gray-500
                focus:border-red-800 focus:outline-none
                py-2
                px-4
              "
            />
          </div>
          <div class="flex-none md:flex md:space-x-4 md:my-4">
            <div
              v-if="selected == 'client'"
              class="w-full md:w-1/2 my-4 md:my-0"
            >
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="cpf"
              >
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                maxlength="14"
                minlength="14"
                placeholder="XXX.XXX.XXX-XX"
                :required="!firstStep && cnpj == undefined"
                @keydown="cpfMasc()"
                v-model="cpf"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div v-else class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="business-name"
              >
                Nome da Empresa
              </label>
              <input
                id="business-name"
                name="business-name"
                type="text"
                placeholder="Ex: Marmoraria do João"
                :required="!firstStep"
                v-model="businessName"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="cnpj"
              >
                CNPJ
              </label>
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                maxlength="18"
                minlength="18"
                placeholder="XX.XXX.XXX/XXXX-XX"
                :required="!firstStep && cpf == undefined"
                @keydown="cnpjMasc()"
                v-model="cnpj"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
          </div>
          <div class="flex-none md:flex md:space-x-4 md:my-4">
            <div class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="password"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="********"
                :required="!firstStep"
                minlength="8"
                @keyup="comparePassword"
                v-model="password"
                class="
                  text-sm
                  sm:text-sm
                  w-full
                  border
                  rounded
                  text-gray-800
                  placeholder-gray-500
                  focus:border-red-800 focus:outline-none
                  py-2
                  px-4
                "
              />
            </div>
            <div class="w-full md:w-1/2 my-4 md:my-0">
              <label
                class="block text-gray-600 text-sm font-bold mb-2"
                for="conf-password"
              >
                Confirme a senha
              </label>
              <div class="relative">
                <div
                  class="
                    absolute
                    flex
                    border border-transparent
                    right-0
                    top-0
                    h-full
                    w-10
                  "
                  @click="showPassword = !showPassword"
                >
                  <div v-if="showPassword"
                    class="
                      flex
                      items-center
                      justify-center
                      rounded-tr rounded-br
                      z-10
                      bg-gray-100
                      text-gray-600 text-md
                      h-full
                      w-full
                      cursor-pointer
                    "
                  >
                    <i class="far fa-eye-slash"></i>
                  
                  </div>
                  <div v-else
                    class="
                      flex
                      items-center
                      justify-center
                      rounded-tr rounded-br
                      z-10
                      bg-gray-100
                      text-gray-600 text-md
                      h-full
                      w-full
                      cursor-pointer
                    "
                  >
                    <i class="far fa-eye"></i>
                  
                  </div>
                </div>
                <input
                  id="conf-password"
                  name="conf-password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Digite a senha novamente"
                  :required="!firstStep"
                  v-model="confPassword"
                  @keyup="comparePassword"
                  class="
                    text-sm
                    sm:text-sm
                    w-full
                    border
                    rounded
                    text-gray-800
                    placeholder-gray-500
                    focus:border-red-800 focus:outline-none
                    py-2
                    pl-2
                    pr-12
                  "
                />
              </div>
            </div>
          </div>

          <div :hidden="passwordsValid">
            <small class="text-red-500 block justify-self-center text-center"
              >As senhas não coincidem!</small
            >
          </div>
          <p class="text-gray-700 text-center mt-2">
            Ao cadastrar, você concorda com os
            <span
              @click="
                openLink(
                  'https://system-photos.s3.sa-east-1.amazonaws.com/Termos-de-Uso-ISTONES.pdf'
                )
              "
              class="text-red-800 cursor-pointer"
              >Termos de Uso</span
            >
            e
            <span
              @click="
                openLink(
                  'https://system-photos.s3.sa-east-1.amazonaws.com/POL%C3%8DTICAS-DE-PRIVACIDADE-Istones.pdf'
                )
              "
              class="cursor-pointer text-red-800"
              >Política de Privacidade</span
            >.
          </p>
          <MessageCard
            class="justify-center"
            :type="type"
            :message="message"
            :title="title"
          />
          <div class="mt-5">
            <button
              type="submit"
              id="but"
              class="
                inline-flex
                justify-center
                items-center
                transition
                duration-150
                py-2
                px-4
                bg-red-800
                hover:bg-red-900
                text-white
                font-bold
                border-b-4 border-red-900
                focus:outline-none
                rounded
                w-full
              "
              :disabled="blockAction"
            >
              <svg
                class="h-5 w-5 mr-2 text-white animate-spin"
                v-if="loading"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Cadastrar
            </button>
          </div>
        </div>
      </form>
      <div class="mt-6 mb-4">
        <button
          class="
            transition
            duration-150
            py-2
            px-4
            bg-gray-600
            hover:bg-gray-900
            text-white
            font-bold
            border-b-4 border-gray-800
            focus:outline-none
            rounded
            w-full
          "
          @click="firstStep = !firstStep"
          :disabled="!isDisabled"
        >
          <span v-if="firstStep == false"
            ><i class="fas fa-arrow-left"></i> Voltar</span
          >
          <span v-else>Avançar <i class="fas fa-arrow-right"></i></span>
        </button>
      </div>
      <div class="flex justify-center items-center mt-4">
        <div>
          <router-link
            class="
              block
              text-sm
              fontme
              text-gray-500
              hover:text-red-700 hover:underline
            "
            to="/login"
            >Fazer Login</router-link
          >
        </div>
      </div>
      <p class="text-center text-gray-500 text-xs mt-10">
        &copy;2020 iStones | All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import MessageCard from "../components/MessageCard.vue";
import Client from "../services/Client.js";
import Salesman from "../services/Salesman.js";

export default {
  data() {
    return {
      firstStep: true,

      name: "",
      surname: "",
      birthdate: "",
      email: "",
      tel: "",
      selected: "client",
      cpf: "",
      cnpj: "",
      businessName: "",
      password: "",
      confPassword: "",

      type: "none",
      title: "",
      message: "",

      cpfValid: false,
      cnpjValid: false,
      telValid: false,
      passwordsValid: true,

      showPassword: false,

      loading: false,
      blockAction: false,
    };
  },
  components: {
    MessageCard,
  },
  computed: {
    isDisabled() {
      return (
        this.name.length &&
        this.surname.length &&
        this.birthdate.length &&
        this.tel.length
      );
    },
  },
  methods: {
    openLink(url) {
      window.open(url, "_blank");
    },
    cpfMasc() {
      this.cpf = this.mCPF(this.cpf);
    },
    cnpjMasc() {
      this.cnpj = this.mCNPJ(this.cnpj);
    },
    telMasc() {
      this.tel = this.mTel(this.tel);
    },
    mCPF(cpf) {
      cpf = cpf.replace(/\D/g, "");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      return cpf;
    },
    mCNPJ(cnpj) {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
      cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
      return cnpj;
    },
    mTel(tel) {
      tel = tel.replace(/\D/g, ""); //Remove tudo o que não é dígito
      tel = tel.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
      tel = tel.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
      return tel;
    },
    comparePassword() {
      if (!this.password.length && !this.confPassword) {
        this.passwordsValid = true;
        return;
      }
      this.password.length < 8 || this.password != this.confPassword
        ? (this.passwordsValid = false)
        : (this.passwordsValid = true);
    },
    async register() {
      this.blockAction = true;
      this.loading = true;
      let data = {
        name: this.name,
        surname: this.surname,
        birthdate: this.birthdate,
        email: this.email,
        tel: this.tel.replace(/\D/g, ""),
        cnpj: this.cnpj ? this.cnpj.replace(/\D/g, "") : undefined,
        password: this.password,
      };
      if (this.selected == "client") {
        data["cpf"] = this.cpf ? this.cpf.replace(/\D/g, "") : undefined;
        let result = await Client.create(data);
        if (result.success) {
          this.type = "success";
          this.message = "Cadastrado com sucesso!";
          this.title = "Sucesso!";
          this.$router.push({
            path: "/confirme",
            query: { id: result.client.id_user },
          });
        } else {
          this.type = "error";
          this.message = result.message;
          this.title = "Erro!";
        }
      } else {
        data["business_name"] = this.businessName;
        let result = await Salesman.create(data);
        if (result.success) {
          this.type = "success";
          this.message = "Cadastrado com sucesso!";
          this.title = "Sucesso!";
          this.$router.push({
            path: "/confirme",
            query: { id: result.salesman.id_user },
          });
        } else {
          this.type = "error";
          this.message = result.message;
          this.title = "Erro!";
        }
      }
      this.loading = false;
      this.blockAction = false;
      setTimeout(() => {
        this.type = "none";
      }, 3000);
    },
  },
};
</script>
