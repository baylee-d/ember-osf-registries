import Ember from 'ember';
import config from 'ember-get-config';

export default Ember.Route.extend({
    model(params) {
        return Ember.RSVP.hash({
            id: params.file_id,
            baseUrl: config.OSF.url,
            renderUrl: config.OSF.renderUrl,

            preprint: this.store.findRecord('preprint', params.file_id),
            supplement: ['hi.txt', 'hello.txt', 'howdy.docx', 'hiya.pdf', 'wuzzup.jpg', 'wuddup.png', 'greetings.png', 'sup.jpg','hi.txt', 'hello.txt', 'howdy.docx', 'hiya.pdf', 'wuzzup.jpg', 'wuddup.png', 'greetings.png', 'sup.jpg',],
//            project: this.store.findRecord('preprint', params.file_id).then(preprint =>
//                this.store.findRecord('file', preprint.get('path')).then(file => file.get('links').download.split('/')[5])),
//            downloadLink: this.store.findRecord('preprint', params.file_id).then(preprint =>
//                this.store.findRecord('file', preprint.get('path')).then(file => file.get('links').download))
        });
    }
});

