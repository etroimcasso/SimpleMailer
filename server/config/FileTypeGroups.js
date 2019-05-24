const { GroupNames, IconNames, GroupColors } = require('./ServerStrings').FileSorting

module.exports = [
	{
		name: GroupNames.Images,
		type: 'images',
		icon: IconNames.Images,
		color: GroupColors.Images,
		extensions: ['.jpg','.jpeg','.jfif','.png','.gif','.bmp'],

	},
	{
		name: GroupNames.Videos,
		type: 'video',
		icon: IconNames.Videos,
		color: GroupColors.Videos,
		extensions:['.mp4','.m4v','.mpg','.mpeg','.avi','.mkv','.wmv','.webm','.flv',
		'.vob','.ogv','.gifv','.mov','.mp2','.m2v','.3gp',],
	},
	{
		name: GroupNames.PDF,
		type: 'pdf',
		icon: IconNames.PDF,
		color: GroupColors.PDF,
		extensions:['.pdf'],

	},
	{
		name: GroupNames.Word,
		type:'word',
		icon: IconNames.Word,
		color: GroupColors.Word,
		extensions: ['.doc','.docx'],

	},
	{
		name: GroupNames.Excel,
		type: 'excel',
		icon: IconNames.Excel,
		color: GroupColors.Excel,
		extensions: ['.xls','.xlsx'],

	},
	{
		name: GroupNames.Powerpoint,
		type: 'powerpoint',
		icon: IconNames.Powerpoint,
		color: GroupColors.Powerpoint,
		extensions: ['.ppt','.pps'],

	},
	{
		name: GroupNames.Text,
		type: 'text',
		icon: IconNames.Text,
		color: GroupColors.Text,
		extensions: ['.txt','.rtf'],

	},
	{
		name: GroupNames.NoExtension,
		type: 'none',
		icon: IconNames.NoExtension,
		color: GroupColors.NoExtension,
	 	extensions: [''],

	},
	{ 
		name: GroupNames.Directories,
		type: 'directory',
		icon: IconNames.Directories,
		color: GroupColors.Directories,
		extensions: [''],

	},
	{
		name: GroupNames.Coding,
		type: 'code',
		icon: IconNames.Coding,
		color: GroupColors.Coding,
		extensions: ['.js','.jsx','.css','.html','.cpp','.h','.c','.php','.py','.json','.md'],

	},
	{
		name: GroupNames.Executables,
		type: 'executable',
		icon: IconNames.Executables,
		color: GroupColors.Executables,
		extensions: ['.exe','.app','.vb','.elf'],

	},
	{
		name: GroupNames.Archives,
		type: 'archives',
		icon: IconNames.Archives,
		color: GroupColors.Archives,
		extensions:['.zip', '.rar','.tgz','.7z','.tar','.gz','.bz2'],

	},

]