import Ember from 'ember';
import CpPanelBodyComponent from 'ember-collapsible-panel/components/cp-panel-body';
import PreprintFormFieldMixin from '../mixins/preprint-form-field';

export default CpPanelBodyComponent.extend(PreprintFormFieldMixin, {
    filter: [{}, {}, {}],
    filteredPath: Ember.computed('path', 'filter', 'filter.@each.value', function() {
        return this.get('path').slice(0, 2).map((path, i) => {
            if (path.children && this.get(`filter.${i + 1}.value`)) {
                return {
                    name: path.name,
                    children: path.children.filter(child =>
                        this.get(`filter.${i + 1}.value`).indexOf(child.name || child) !== -1)
                };
            }
            return path;
        });
    }),
    sortedTaxonomies: Ember.computed('taxonomies', 'filter', 'filter.0.value', function() {
        return [{
            name: 'a',
            children: [{
                name: 'b',
                children: ['c', 'd', 'e']
            }, {
                name: 'f',
                children: ['g']
            }],
        }, {
            name: 'h',
            children: [{
                name: 'i',
                children: ['j', 'k']
            }]
        }, {
            name: 'l'
        }].filter(taxonomy =>
            !this.get('filter.0.value') || taxonomy.name.indexOf(this.get('filter.0.value')) !== -1
        );
    }),
    path: [],
    selected: new Ember.Object(),
    // sortedSelection: Ember.computed('selected', function() {
    //     const selected = this.get('selected');
    //     const taxonomies = Object.keys(selected);
    //     const temp = taxonomies
    //         .map(taxonomy => selected.get(taxonomy))
    //         .filter(categories => categories);
    //     const categories = temp
    //         .reduce((prev, cur) => prev.concat(Object.keys(cur)), []);
    //     const subjects = temp
    //         .map(categories => Object.keys(categories)
    //             .map(category => categories.get(category))
    //             .filter(subjects => subjects)
    //             .reduce((prev, cur) => prev.concat(Object.keys(cur)), []))
    //         .reduce((prev, cur) => prev.concat(cur));
    //     return {
    //         taxonomies: taxonomies,
    //         categories: categories,
    //         subjects: subjects
    //     };
    // }),
    sortedSelection: Ember.computed('selected', function() {
        const sorted = [];
        const selected = this.get('selected');
        const flatten = ([obj, name = []]) => {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return name.length !== 0 && sorted.pushObject(name);
            } else {
                return keys.sort().map(key => [obj.get(key), [...name, key]]).forEach(flatten);
            }
        };
        flatten([selected]);
        return sorted;
    }),
    valid: Ember.computed('selected', function() {
        return Object.keys((this.get('selected'))).length !== 0;
    }),
    actions: {
        delete(key) {
            this.set(key, null);
            // Handle keys with spaces
            eval(`delete this['${key.replace(/\./g, "']['")}']`);
        },
        deselect([...args]) {
            this.send('delete', `selected.${args.filter(arg => Ember.typeOf(arg) === 'string').join('.')}`);
            this.notifyPropertyChange('selected');
            this.rerender();
        },
        select(...args) {
            const process = (prev, cur, i) => {
                if (!this.get(`selected.${prev}`)) {
                    // Create necessary parent objects and newly selected object
                    this.set(`selected.${prev}`, new Ember.Object());
                } else if (i === args.length && this.get('path').every((e, i) => e === args[i])
                    && Object.keys(this.get(`selected.${prev}`)).length === 0) {
                    // Deselecting a subject: if subject is last item in args,
                    // its children are showing, and no children are selected
                    this.send('delete', `selected.${prev}`);
                    args.popObject();
                }
                return `${prev}.${cur}`;
            };
            // Process past length of array
            process(args.map(arg => arg.name || arg).reduce(process), '', args.length);
            this.set('path', args);
            this.notifyPropertyChange('selected');
            this.rerender();
        }
    }
});
