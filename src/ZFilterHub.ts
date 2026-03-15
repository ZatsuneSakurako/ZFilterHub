import eventEmitter3 from "eventemitter3";

export type FilterMap = {
	/**
	 *  key: Event => [[...arguments], returnType]
	 */
	[key: string]: [any[], any]
};

export type EventMap = {
	/**
	 *  key: Event => arguments
	 */
	[key: string]: any[]
};

export class ZFilterHub<Filters extends FilterMap, Events extends EventMap> extends eventEmitter3.EventEmitter {
	#filters = new Map<keyof Filters, ((value:any, ...data:any[]) => any)[]>();

	/**
	 * Add a filter
	 * @param filterName
	 * @param callback
	 */
	public addFilter<E extends keyof Filters>(filterName: E, callback: (value: Filters[E][1], ...data: Filters[E][0]) => Filters[E][1]) {
		let arr = this.#filters.get(filterName);
		if (!arr) {
			arr = [];
			this.#filters.set(filterName, arr);
		}
		arr.push(callback);
		return this;
	}

	/**
	 * Apply a filter, and if the value **becomes** undefined/null/false, stop and return it
	 * @param filterName
	 * @param value
	 * @param args
	 */
	public applyFilter<E extends keyof Filters>(filterName: E, value: Filters[E][1], ...args: Filters[E][0]): Filters[E][1] {
		const arr: ((value: Filters[E][1], ...data: Filters[E][0]) => Filters[E][1])[] | undefined = this.#filters.get(filterName);
		if (arr && arr.length) {
			const initialValueFalsy = value === undefined || value === null || value === false;
			for (let cb of arr) {
				try {
					value = cb(value, ...args);
				} catch (e) {
					console.error(e);
				}

				if (!initialValueFalsy && (value === undefined || value === null || value === false)) {
					break;
				}
			}
			return value;
		}
		return value;
	}

	/**
	 * Remove a filter
	 * @param filterName
	 * @param callback
	 */
	public removeFilter<E extends keyof Filters>(filterName: E, callback: (value: Filters[E][1], data: Filters[E][0]) => Filters[E][1]) {
		let arr: ((value: Filters[E][1], data: Filters[E][0]) => Filters[E][1])[] | undefined = this.#filters.get(filterName);
		if (arr && arr.length) {
			for (let [i, arrElement] of arr.entries()) {
				if (callback === arrElement) {
					delete arr[i];
				}
			}
		}
	}



	public on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
	public on<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void): this
	public on(event: string | symbol, listener: (...args: any[]) => void): this {
		super.on(event, listener);
		return this;
	}

	public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
	public emit<S extends string | symbol>(event: Exclude<S, keyof Events>, ...args: any[]): boolean;
	public emit(event: string | symbol, ...args:any[]): boolean {
		return super.emit(event, ...args);
	}

	public once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
	public once<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void): this;
	public once(event: string | symbol, listener: (...args: any[]) => void): this {
		super.once(event, listener);
		return this;
	}

	public off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
	public off<S extends string | symbol>(event: Exclude<S, keyof Events>, listener: (...args: any[]) => void): this;
	public off(event: string | symbol, listener: (...args: any[]) => void): this {
		super.off(event, listener);
		return this;
	}

	public removeAllListeners<K extends keyof Events>(event?: K): this;
	public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof Events>): this;
	public removeAllListeners(event?: string | symbol): this {
		super.removeAllListeners(event);
		return this;
	}
}
