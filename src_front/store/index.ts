import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		initComplete: false,
		tooltip: null,
		alert: null,
		confirm:{
			title:null,
			description:null,
			confirmCallback:null,
			cancelCallback:null,
			yesLabel:null,
			noLabel:null,
		},
	},
	mutations: {
		confirm(state, payload) { state.confirm = payload; },

		alert(state, payload) { state.alert = payload; },

		openTooltip(state, payload) { state.tooltip = payload; },
		
		closeTooltip(state) { state.tooltip = null; },

	},
	actions: {
		async startApp({ state, commit, dispatch }, payload) { 
			state.initComplete = true;
			return true;
		},

		confirm({commit}, payload) { commit("confirm", payload); },

		alert({commit}, payload) { commit("alert", payload); },

		openTooltip({commit}, payload) { commit("openTooltip", payload); },
		
		closeTooltip({commit}) { commit("closeTooltip", null); },

	},
})
