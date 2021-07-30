<template>
	<div class="home">
		<div class="message">
			<p>App up and running</p>
			<div>
				<div v-for="k in keys" :key="k.keyCode">
					<span>{{k.keyCode}} : </span>
					<span>{{k.state}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import SockController, { SOCK_ACTIONS } from "@/sock/SockController";
import SocketEvent from "@/vo/SocketEvent";
import { Component, Inject, Model, Prop, Vue, Watch, Provide } from "vue-property-decorator";

@Component({
	components: {
		Button,
	},
})
export default class Home extends Vue {

	public keys:{[key:string]:{keyCode:string, state:string, date:number}} = {};

	private socketHandler:Function;
	private cleanInterval:number;

	public async mounted():Promise<void> {
		this.socketHandler = (e:SocketEvent) => this.onSocketEvent(e);
		SockController.instance.addEventListener(SOCK_ACTIONS.KEY_UP, this.socketHandler);
		SockController.instance.addEventListener(SOCK_ACTIONS.KEY_DOWN, this.socketHandler);
		SockController.instance.addEventListener(SOCK_ACTIONS.KEY_PRESSED, this.socketHandler);

		this.cleanInterval = setInterval(_=> this.cleanReleasedKeys(), 100)
	}

	public beforeDestroy(): void {
		SockController.instance.removeEventListener(SOCK_ACTIONS.KEY_UP, this.socketHandler);
		SockController.instance.removeEventListener(SOCK_ACTIONS.KEY_DOWN, this.socketHandler);
		SockController.instance.removeEventListener(SOCK_ACTIONS.KEY_PRESSED, this.socketHandler);
		clearInterval(this.cleanInterval);
	}

	private onSocketEvent(e:SocketEvent):void {
		let keyCode = e.data.keyCode;
		switch(e.getType()) {
			case SOCK_ACTIONS.KEY_DOWN:
				Vue.set(this.keys, keyCode, {keyCode, state: "down", date:Date.now()});
				break;
				
			case SOCK_ACTIONS.KEY_PRESSED:
				Vue.set(this.keys, keyCode, {keyCode, state: "pressed", date:Date.now()});
				break;

			case SOCK_ACTIONS.KEY_UP:
				Vue.set(this.keys, keyCode, {keyCode, state: "up", date:Date.now()});
				break;
		}
	}

	private cleanReleasedKeys():void {
		let now = Date.now();
		for (const key in this.keys) {
			let k = this.keys[key];
			if (k.state == "up" && k.date < now - 1000) {
				Vue.delete(this.keys, key);
			}
		}
	}

}
</script>

<style scoped lang="less">
.home {
	.message {
		display: block;
		margin: auto;
		background-color: @mainColor_normal;
		color: @mainColor_dark;
		padding: 20px;
		border-radius: 20px;
		font-weight: bold;
	}
}

</style>