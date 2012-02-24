Ext.define('Todo.controller.Tasks', {

    models: ['Task'],

    stores: ['Tasks'],

    extend: 'Ext.app.Controller',

    views: ['TaskField', 'TaskList', 'TaskToolbar'],

    refs: [
        {ref: 'taskList', selector: 'taskList'},
        {ref: 'taskToolbar', selector: 'taskToolbar'},
    ],

    init: function() {
        this.control({
            'taskField': {
                keyup: this.onTaskFieldKeyup
            },
            'taskList': {
                todoChecked: this.onTodoChecked,
                itemdblclick: this.onTodoDblClicked
            },
            'completeButton': {
                click: this.onClearButtonClick
            },
            'checkAllBox': {
                click: this.onCheckAllClick
            }
        });

        this.getTasksStore().on({
            scope: this,
            update: this.onStoreDataChanged,
            datachanged: this.onStoreDataChanged
        });
    },

    onTaskFieldKeyup: function(field, event) {
        var ENTER_KEY_CODE = 13;
        var value = field.getValue();
        if (event.keyCode === ENTER_KEY_CODE && value !== '') {
            var store = this.getTasksStore();
            store.add({label: value, checked: false});
            field.reset();
            store.sync();
        }
    },

    onTodoChecked: function(record) {
        record.set('checked', !record.get('checked'));
        record.store.sync();
        record.commit();
    },

    onTodoDblClicked: function (list, record, el) {
        // TODO Figure out why mouse up within the editing text box causes it to redraw and lose focus
        record.set('editing', true);
        record.store.sync();
        record.commit();
    },

    onClearButtonClick: function() {
        var records = [],
            store = this.getTasksStore();

        store.each(function(record) {
            if (record.get('checked')) {
                records.push(record);
            }
        });
        store.remove(records);
        store.sync();
    },

    onCheckAllClick: function(checked) {
        console.log('on check all');
        var store = this.getTasksStore();
        store.each(function(record) {
            record.set('checked', checked);
        });
        store.sync();
    },

    onStoreDataChanged: function() {
        var info = '', text = '',
            store = this.getTasksStore(),
            totalCount = store.getCount(),
            toolbar = this.getTaskToolbar(),
            button = toolbar.items.first(),
            container = toolbar.items.last(),
            records = store.queryBy(function(record) {
                return !record.get('checked');
            }),
            count = records.getCount(),
            checkedCount = totalCount - count;

        if (count) {
            info = '<b>' + count + '</b> item' + (count > 1 ? 's' : '') + ' left.';
        }

        if (checkedCount) {
            text = 'Clear '+ checkedCount +' completed item' + (checkedCount > 1 ? 's' : '');
        }

        container.update(info);
        button.setText(text);
        button.setVisible(checkedCount);
        toolbar.setVisible(totalCount);
    }

});
