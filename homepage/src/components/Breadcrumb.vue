<template>
    <ol id="breadcrumb">
        <li class="home"><span class="hidden">홈페이지 바로가기</span></li>
        <li v-for="(part, i) in paths" :key="i" :class="{ on : ! isLastPath(i) }">
            <router-link v-if="! isLastPath(i)" class="on" :to="menuitems(i)[part].uri">{{ menuitems(i)[part].name }}</router-link>
            <span v-if="isLastPath(i)">{{ menuitems(i)[part].name }}</span>
        </li>
    </ol>
</template>

<script>
export default {
    name: 'breadcrumb',

    props: [ 'menus' ],

    created() {
        //console.log(this.paths)
    },

    computed: {
        paths() {
            let path = this.$route.path

            if (path.charAt(path.length - 1) === '/') {
                path = path.substring(0, path.length - 2)
            }

            let array = path.split('/')

            return array.splice(1, array.length - 1)
        }
    },

    methods: {
        isLastPath(index) {
            return this.paths.length - 1 === index
        },

        menuitems(depth) {
            let
                items = this.menus,
                paths = this.paths

            for (let i = 0; i < depth; i++) {
                let path = paths[i]
                items = items[path].children
            }

            // console.log(items)

            return items
        }
    }
}
</script>