import { h, Component } from 'preact';

export function connect(mapStateToProps, actions) {
	if (typeof mapStateToProps!=='function') {
		mapStateToProps = select(mapStateToProps || []);
	}
	return Child => {
		function Wrapper(props, { store }) {
			let state = mapStateToProps(store ? store.getState() : {}, props);
			let boundActions = actions ? mapActions(actions, store) : { store };
			let update = () => {
				let mapped = mapStateToProps(store ? store.getState() : {}, this.props);
				for (let i in mapped) if (mapped[i]!==state[i]) {
					state = mapped;
					return this.setState(null);
				}
				for (let i in state) if (!(i in mapped)) {
					state = mapped;
					return this.setState(null);
				}
			};
			this.componentDidMount = () => {
				update();
				store.subscribe(update);
			};
			this.componentWillUnmount = () => {
				store.unsubscribe(update);
			};
			this.render = props => h(Child, assign(assign(assign({}, boundActions), props), state));
		}
		return (Wrapper.prototype = new Component()).constructor = Wrapper;
	};
}


export function Provider(props) {
	this.getChildContext = () => ({ store: props.store });
}

Provider.prototype.render = props => props.children[0];


export default function createStore(state) {
	let listeners = [];
	state = state || {};

	function unsubscribe(listener) {
		let out = [];
		for (let i=0; i<listeners.length; i++) {
			if (listeners[i]===listener) {
				listener = null;
			}
			else {
				out.push(listeners[i]);
			}
		}
		listeners = out;
	}

	function setState(update, overwrite, action) {
		state = overwrite ? update : assign(assign({}, state), update);
		let currentListeners = listeners;
		for (let i=0; i<currentListeners.length; i++) currentListeners[i](state, action);
	}

	return {
		action(action) {
			function apply(result) {
				setState(result, false, action);
			}
			return function() {
				let args = [state];
				for (let i=0; i<arguments.length; i++) args.push(arguments[i]);
				let ret = action.apply(this, args);
				if (ret!=null) {
					if (ret.then) ret.then(apply);
					else apply(ret);
				}
			};
		},

		setState,
		subscribe(listener) {
			listeners.push(listener);
			return () => { unsubscribe(listener); };
		},
		unsubscribe,
		getState() {
			return state;
		}
	};
}

// Bind an object/factory of actions to the store and wrap them.
function mapActions(actions, store) {
	if (typeof actions==='function') actions = actions(store);
	let mapped = {};
	for (let i in actions) {
		mapped[i] = store.action(actions[i]);
	}
	return mapped;
}


// select('foo,bar') creates a function of the form: ({ foo, bar }) => ({ foo, bar })
function select(properties) {
	if (typeof properties==='string') properties = properties.split(/\s*,\s*/);
	return state => {
		let selected = {};
		for (let i=0; i<properties.length; i++) {
			selected[properties[i]] = state[properties[i]];
		}
		return selected;
	};
}

function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}
