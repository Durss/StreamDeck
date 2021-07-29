
<template>
	<div id="app" class="app">
		<router-view class="view" />
		<Confirm />
		<Alert />
		<Tooltip />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Confirm from "./views/Confirm.vue";
import Alert from "./views/AlertView.vue";
import Tooltip from "./components/Tooltip.vue";
import Config from "./utils/Config";

@Component({
	components:{
		Alert,
		Tooltip,
		Confirm,
	}
})
export default class App extends Vue {

	public async mounted():Promise<void> {
	}

	public beforeDestroy():void {
	}

}
</script>

<style scoped lang="less">
.app{
	font-family: Futura, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
	min-height: 100vh;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	.view {
		height: 100%;
		min-height: 100%;
		padding-top: 20px;
		padding-bottom: 35px;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.footer {
		position: fixed;
		background-color: @mainColor_dark_light;
		height: 35px;
		color: @mainColor_light;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-family: "Nunito Light";
		width: 100%;
		bottom: 0;
		box-shadow: 0px -5px 5px 0px rgba(0,0,0,0.2);
	}
}
</style>