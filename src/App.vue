<template>
  <div id="main-div">
    <div id="div-header">
      <img src="./assets/logo.png" style="width: 145px;" />
      <h1>Welcome to my <br>"Weather APP - Inlämningsuppgift 2"</h1>
      <router-link v-if="!linkClicked" to="/weather" @click="handleLinkClick">
        Click here to start your Weather Search
      </router-link>
      <router-view></router-view>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      linkClicked: false,
    };
  },
  methods: {
    handleLinkClick(event) {
      this.linkClicked = true;
      event.preventDefault(); 
    },
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#div-header{
  background-color: #1f71ac42;
}

#main-div{
  width: 650px;
  margin: auto;
  text-align: center;
  border: #2c3e50 solid 1px;
  border-radius: 15px;
  color: #2c3e50;
}

a{
  color: blue;
  text-decoration: none;
}
</style>
