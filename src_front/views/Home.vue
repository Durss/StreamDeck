<template>
	<div class="home">
		<div class="message">App up and running</div>
	</div>
</template>

<script lang="ts">
import Button from "@/components/Button.vue";
import { Component, Inject, Model, Prop, Vue, Watch, Provide } from "vue-property-decorator";

@Component({
	components: {
		Button,
	},
})
export default class Home extends Vue {

	public async mounted():Promise<void> {
	}

	public beforeDestroy(): void {
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