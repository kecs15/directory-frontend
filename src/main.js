// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'


Vue.config.productionTip = false

Vue.component('grid', {
    template: '#grid',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        gridColumns: ['Name', 'Department', 'Position', 'Business_Email', 'Personal_Email', 'Business_Phone', 'Personal_Phone'],
        gridData: []
    },
    mounted(){
        axios.get('http://127.0.0.1:8000/api/directory',{
            header: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then(response => {
            let data = response.data;
            for(let i in data){
                this.gridData.push({
                    key: i,
                    Name: data[i].first_name +' '+ data[i].second_name + ' ' + data[i].last_name,
                    Department: data[i].department.name,
                    Position: data[i].position.name,
                    Business_Email: null,
                    Personal_Phone: null,
                    Business_Phone: null
                });
                for(let j in data[i].phones){
                    if(data[i].phones[j].personal == true){
                        this.gridData[i].Personal_Phone = data[i].phones[j].number;
                    }else{
                        this.gridData[i].Business_Phone = data[i].phones[j].number;
                    }
                    if(data[i].emails[j].personal == true){
                        this.gridData[i].Personal_Email = data[i].emails[j].email;
                    }else{
                        this.gridData[i].Business_Email = data[i].emails[j].email;
                    }
                }
            }
        })
    }
})
