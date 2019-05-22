const GroupNames = require('./ServerStrings').FileSorting.GroupNames

module.exports = [
	{
		name: GroupNames.Images,
		type: 'images',
		extensions: ['.jpg','.jpeg','.jfif','.png','.gif','.bmp'],

	},
	{
		name: GroupNames.Videos,
		type: 'video',
		extensions:['.mp4','.avi','.mkv','.wmv'],

	},
	{
		name: GroupNames.PDF,
		type: 'pdf',
		extensions:['.pdf'],

	},
	{
		name: GroupNames.Word,
		type:'word',
		extensions: ['.doc','.docx'],

	},
	{
		name: GroupNames.Excel,
		type: 'excel',
		extensions: ['.xls','.xlsx'],

	},
	{
		name: GroupNames.Powerpoint,
		type: 'powerpoint',
		extensions: ['.ppt','.pps'],

	},
	{
		name: GroupNames.Text,
		type: 'text',
		extensions: ['.txt','.rtf'],

	},
	{
		name: GroupNames.NoExtension,
		type: 'none',
	 	extensions: [''],

	},
	{ 
		name: GroupNames.Directories,
		type: 'directory',
		extensions: [''],

	},
	{
		name: GroupNames.Coding,
		type: 'code',
		extensions: ['.js','.jsx','.css','.html','.cpp','.h','.c','.php','.py'],

	},
	{
		name: GroupNames.Executables,
		type: 'executable',
		extensions: ['.exe','.app','.vb','.elf'],

	},
	{
		name: GroupNames.Archives,
		type: 'archives',
		extensions:['.zip', '.rar','.tgz','.7z','.tar','.gz','.bz2'],

	},

]