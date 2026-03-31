import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: '云服务', description: '各大云服务商优惠活动及介绍' },
    { name: '编程工具', description: '提升开发效率的工具和IDE' },
    { name: '技术教程', description: '各类编程语言及框架的教程' },
    { name: '开源项目', description: '优质的开源项目推荐' },
    { name: '域名服务器', description: '域名注册及服务器选购指南' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  const user = await prisma.user.upsert({
    where: { email: 'admin@trae.ai' },
    update: {},
    create: {
      email: 'admin@trae.ai',
      passwordHash: 'hashed_password_mock',
      username: 'TraeAdmin',
      role: 'ADMIN',
    },
  });

  const dbCategories = await prisma.category.findMany();

  if ((await prisma.resource.count()) === 0) {
    await prisma.resource.create({
      data: {
        title: 'React 官方文档中译版',
        description: 'React 是用于构建用户界面的 JavaScript 库。这是最新的 React 18 中文文档。',
        url: 'https://zh-hans.react.dev/',
        authorId: user.id,
        categoryId: dbCategories.find(c => c.name === '技术教程')?.id,
        tags: JSON.stringify(['React', '前端', '教程']),
        viewCount: 1520,
        likeCount: 345,
      }
    });

    await prisma.resource.create({
      data: {
        title: 'Trae - 智能开发工具',
        description: 'Trae 是一款结合了 AI 能力的新一代开发工具，极大提升开发效率。',
        url: 'https://trae.ai',
        authorId: user.id,
        categoryId: dbCategories.find(c => c.name === '编程工具')?.id,
        tags: JSON.stringify(['AI', 'IDE', '工具']),
        viewCount: 3200,
        likeCount: 890,
      }
    });
    
    await prisma.resource.create({
      data: {
        title: 'Next.js 快速入门',
        description: 'Vercel 出品的 React 服务端渲染框架，支持静态导出和无服务器部署。',
        url: 'https://nextjs.org/',
        authorId: user.id,
        categoryId: dbCategories.find(c => c.name === '开源项目')?.id,
        tags: JSON.stringify(['Next.js', 'React', '全栈']),
        viewCount: 850,
        likeCount: 210,
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
