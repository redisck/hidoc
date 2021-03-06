'use strict'

let fs = require('fs'),
	_  = require('./util'),
	md = require('marked'),
	path = process.cwd(),
	src = path + '/src/',
	dist = path + '/dist/',
	title,
	menu,
	second,
	secondReg = /<h2([^>]*)>(.*)<\/h2>/ig,
	tpl = fs.readFileSync(__dirname + '/tpl.html', 'utf8') //获取模板

/**
 * [获取到menu列表, 并动态添加className]
 * @param  {[type]} list) [description]
 * @return {[type]}       [description]
 */
let formatMenu = (list, filename) => list.map((x) => x.replace(/(.*?)\.md$/ig, ($1, $2) => (filename.indexOf($2) > -1 ? '<li class="current">' : '<li>') + '<a href="./' + $2 + '.html">' + $2 + '</a></li>')).join('')

/**
 * [获取二级菜单]
 * @return {[type]} [description]
 */
let getSecondLevel = (data) => data.match(secondReg).map((x) => x.replace(/<[^>]+>/g, '')).map((x) => '<li><a class="second-level" data-scroll href="#' + x + '">' + x + '</a></li>').join('')

/**
 * [遍历目录下的md]
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
let traverseFiles = (files) => {

	files.forEach(function(file){

		fs.readFile(src + file, 'utf8', (err, data) => {
			if (err) throw err

			data = md(data)

			title = _.getTitle(data)
			/**
			 * [动态生成menu]
			 * @type {[type]}
			 */
			menu = formatMenu(files, file)

			second = getSecondLevel(data)

			fs.writeFile(dist + _.rename(file), _.replaceTxt(tpl, title, menu, second, data), 'utf8', () => {
				console.log(file + ' conversion complete')
			})
		})
	})
}

exports.init = (fn) => {

	_.checkDistDir(dist, () => {
		fs.readdir(src, (err, files) => {
			if (err) throw err

			traverseFiles(files)
		})

		if (fn) fn()
	})
}