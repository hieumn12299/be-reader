import 'dotenv/config';
import { PrismaClient, Role, StoryStatus, ChapterStatus } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================================
  // 1. Create Users
  // ============================================================
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@reader.com' },
    update: {},
    create: {
      email: 'admin@reader.com',
      passwordHash,
      displayName: 'Admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@reader.com' },
    update: {},
    create: {
      email: 'author@reader.com',
      passwordHash,
      displayName: 'Nguyễn Tác Giả',
      role: Role.AUTHOR,
      emailVerified: true,
    },
  });

  const reader = await prisma.user.upsert({
    where: { email: 'reader@reader.com' },
    update: {},
    create: {
      email: 'reader@reader.com',
      passwordHash,
      displayName: 'Trần Độc Giả',
      role: Role.READER,
      emailVerified: true,
    },
  });

  console.log('✅ Users created:', {
    admin: admin.email,
    author: author.email,
    reader: reader.email,
  });

  // ============================================================
  // 2. Create Genres
  // ============================================================
  const genres = await Promise.all([
    prisma.genre.upsert({
      where: { slug: 'fantasy' },
      update: {},
      create: { name: 'Fantasy', slug: 'fantasy' },
    }),
    prisma.genre.upsert({
      where: { slug: 'romance' },
      update: {},
      create: { name: 'Romance', slug: 'romance' },
    }),
    prisma.genre.upsert({
      where: { slug: 'horror' },
      update: {},
      create: { name: 'Horror', slug: 'horror' },
    }),
    prisma.genre.upsert({
      where: { slug: 'sci-fi' },
      update: {},
      create: { name: 'Sci-Fi', slug: 'sci-fi' },
    }),
    prisma.genre.upsert({
      where: { slug: 'slice-of-life' },
      update: {},
      create: { name: 'Slice of Life', slug: 'slice-of-life' },
    }),
  ]);

  console.log('✅ Genres created:', genres.map((g) => g.name).join(', '));

  // ============================================================
  // 3. Create Tags
  // ============================================================
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Trending' },
      update: {},
      create: { name: 'Trending' },
    }),
    prisma.tag.upsert({
      where: { name: 'New' },
      update: {},
      create: { name: 'New' },
    }),
    prisma.tag.upsert({
      where: { name: 'Complete' },
      update: {},
      create: { name: 'Complete' },
    }),
    prisma.tag.upsert({
      where: { name: 'Hot' },
      update: {},
      create: { name: 'Hot' },
    }),
    prisma.tag.upsert({
      where: { name: 'Featured' },
      update: {},
      create: { name: 'Featured' },
    }),
  ]);

  console.log('✅ Tags created:', tags.map((t) => t.name).join(', '));

  // ============================================================
  // 4. Create Stories with Chapters
  // ============================================================
  const storiesData = [
    {
      title: 'Kiếm Hiệp Truyền Kỳ',
      slug: 'kiem-hiep-truyen-ky',
      description:
        'Câu chuyện về một kiếm khách trẻ tuổi bước vào giang hồ, học được những bí kíp võ công thất truyền và đối đầu với các thế lực hắc ám để bảo vệ công lý.',
      status: StoryStatus.PUBLISHED,
      genreIndex: 0, // Fantasy
      tagIndices: [0, 3], // Trending, Hot
      viewCount: 15200,
      chapters: [
        {
          title: 'Chương 1: Khởi đầu',
          content:
            'Trên đỉnh núi Thái Sơn, mây mù bao phủ. Một thiếu niên tay cầm thanh kiếm gỉ sét đứng nhìn xa xăm về phía chân trời...',
          wordCount: 3200,
        },
        {
          title: 'Chương 2: Bí kíp thất truyền',
          content:
            'Trong hang động cổ xưa, ánh sáng le lói chiếu vào một cuốn sách cũ kỹ. Trang giấy đã ngả vàng nhưng những dòng chữ vẫn còn rõ ràng...',
          wordCount: 4100,
        },
        {
          title: 'Chương 3: Cuộc chiến đầu tiên',
          content:
            'Tiếng kiếm va nhau vang lên giữa rừng trúc. Gió thổi mạnh, lá trúc bay tứ tung. Hai bóng người di chuyển nhanh như chớp...',
          wordCount: 3800,
        },
      ],
    },
    {
      title: 'Tình Yêu Học Đường',
      slug: 'tinh-yeu-hoc-duong',
      description:
        'Mối tình đầu trong sáng của hai học sinh cuối cấp, giữa áp lực thi cử và những rung động đầu đời.',
      status: StoryStatus.PUBLISHED,
      genreIndex: 1, // Romance
      tagIndices: [1, 4], // New, Featured
      viewCount: 23400,
      chapters: [
        {
          title: 'Chương 1: Ngày đầu tiên',
          content:
            'Buổi sáng mùa thu, nắng vàng xuyên qua hàng cây phượng. Tiếng chuông trường vang lên, báo hiệu một năm học mới bắt đầu...',
          wordCount: 2800,
        },
        {
          title: 'Chương 2: Bạn cùng bàn',
          content:
            'Cô giáo chủ nhiệm bước vào lớp với nụ cười hiền hòa. "Hôm nay chúng ta có một bạn mới chuyển trường đến..."',
          wordCount: 3200,
        },
        {
          title: 'Chương 3: Mưa chiều',
          content:
            'Trời đổ mưa bất chợt. Hai người đứng dưới mái hiên thư viện, im lặng nhìn những hạt mưa rơi. Không ai nói gì nhưng trái tim đều đập nhanh hơn...',
          wordCount: 3500,
        },
      ],
    },
    {
      title: 'Bóng Tối Rừng Sâu',
      slug: 'bong-toi-rung-sau',
      description:
        'Nhóm bạn trẻ lạc vào khu rừng cấm, nơi ẩn chứa những bí mật kinh hoàng từ thời xa xưa.',
      status: StoryStatus.PUBLISHED,
      genreIndex: 2, // Horror
      tagIndices: [3], // Hot
      viewCount: 8900,
      chapters: [
        {
          title: 'Chương 1: Lời cảnh báo',
          content:
            'Tấm biển "CẤM VÀO" đã cũ kỹ, rêu phong bám đầy. Nhưng sự tò mò của tuổi trẻ luôn mạnh hơn mọi lời cảnh báo...',
          wordCount: 2500,
        },
        {
          title: 'Chương 2: Tiếng thì thầm',
          content:
            'Đêm xuống. Trong lều trại, ánh lửa bập bùng chiếu lên những khuôn mặt lo lắng. Từ xa, tiếng thì thầm vọng lại...',
          wordCount: 3100,
        },
      ],
    },
    {
      title: 'Hành Tinh Xa Lạ',
      slug: 'hanh-tinh-xa-la',
      description:
        'Năm 2150, con tàu vũ trụ Horizon phát hiện một hành tinh có sự sống. Đội thám hiểm bước vào hành trình khám phá đầy bất ngờ.',
      status: StoryStatus.PUBLISHED,
      genreIndex: 3, // Sci-Fi
      tagIndices: [0, 4], // Trending, Featured
      viewCount: 12700,
      chapters: [
        {
          title: 'Chương 1: Tín hiệu',
          content:
            'Màn hình radar nhấp nháy liên tục. Thuyền trưởng Kim bước nhanh đến bảng điều khiển, đôi mắt sáng lên khi đọc dữ liệu...',
          wordCount: 3600,
        },
        {
          title: 'Chương 2: Hạ cánh',
          content:
            'Con tàu xuyên qua tầng khí quyển xanh biếc. Bên dưới là một thế giới hoàn toàn khác biệt với mọi thứ nhân loại từng biết...',
          wordCount: 4200,
        },
        {
          title: 'Chương 3: Cuộc gặp gỡ',
          content:
            'Giữa khu rừng pha lê, một sinh vật kỳ lạ xuất hiện. Nó không hung dữ, nhưng ánh mắt nó chứa đựng một trí tuệ khiến cả đội sửng sốt...',
          wordCount: 3900,
        },
      ],
    },
    {
      title: 'Ngày Thường Bình Yên',
      slug: 'ngay-thuong-binh-yen',
      description:
        'Những mẩu chuyện nhỏ về cuộc sống thường ngày ở một con hẻm nhỏ Sài Gòn, nơi mọi người sống chân thành và yêu thương.',
      status: StoryStatus.COMPLETED,
      genreIndex: 4, // Slice of Life
      tagIndices: [2, 4], // Complete, Featured
      viewCount: 18300,
      chapters: [
        {
          title: 'Chương 1: Quán cà phê sáng',
          content:
            'Năm giờ sáng, bà Tư đã nhóm bếp. Mùi cà phê phin bay khắp con hẻm nhỏ. Tiếng xe máy lác đác, người đi tập thể dục bắt đầu ghé quán...',
          wordCount: 2200,
        },
        {
          title: 'Chương 2: Hàng xóm',
          content:
            'Nhà cô Ba bán bún, nhà chú Năm sửa xe, nhà dì Sáu may đo. Mỗi nhà một nghề, nhưng chung một con hẻm, chung niềm vui nỗi buồn...',
          wordCount: 2800,
        },
        {
          title: 'Chương 3: Mùa mưa',
          content:
            'Sài Gòn vào mùa mưa. Nước ngập ngang đầu gối. Cả xóm cùng nhau tát nước, cùng cười giữa cơn mưa tầm tã...',
          wordCount: 2400,
        },
      ],
    },
    {
      title: 'Pháp Sư Cuối Cùng',
      slug: 'phap-su-cuoi-cung',
      description:
        'Trong thế giới nơi phép thuật đang dần biến mất, pháp sư cuối cùng phải tìm cách khôi phục nguồn ma lực trước khi quá muộn.',
      status: StoryStatus.DRAFT,
      genreIndex: 0, // Fantasy
      tagIndices: [],
      viewCount: 0,
      chapters: [],
    },
    {
      title: 'Mật Mã Thời Gian',
      slug: 'mat-ma-thoi-gian',
      description:
        'Một nhà khoa học tình cờ phát hiện cách giải mã thời gian, nhưng mỗi lần du hành lại thay đổi hiện tại theo những cách không lường trước.',
      status: StoryStatus.PUBLISHED,
      genreIndex: 3, // Sci-Fi
      tagIndices: [1], // New
      viewCount: 5600,
      chapters: [
        {
          title: 'Chương 1: Phát hiện',
          content:
            'Phòng thí nghiệm tối om. Giáo sư Minh nhìn chằm chằm vào màn hình, những con số nhảy múa. Rồi bỗng nhiên, mọi thứ dừng lại...',
          wordCount: 3400,
        },
        {
          title: 'Chương 2: Lần nhảy đầu tiên',
          content:
            'Ánh sáng chói lóa! Khi mở mắt ra, giáo sư Minh thấy mình đứng giữa một Sài Gòn hoàn toàn khác. Xe ngựa, áo dài, đèn dầu...',
          wordCount: 3700,
        },
      ],
    },
    {
      title: 'Bản Tình Ca Mùa Đông',
      slug: 'ban-tinh-ca-mua-dong',
      description:
        'Câu chuyện tình buồn giữa một nhạc sĩ đường phố và cô gái đến từ thành phố khác, gặp nhau vào mùa đông Đà Lạt.',
      status: StoryStatus.HIATUS,
      genreIndex: 1, // Romance
      tagIndices: [],
      viewCount: 3200,
      chapters: [
        {
          title: 'Chương 1: Đêm Đà Lạt',
          content:
            'Sương mù buông xuống. Tiếng guitar vang lên bên hồ Xuân Hương. Anh hát bản tình ca cũ, không biết rằng có ai đó đang lặng lẽ lắng nghe...',
          wordCount: 2900,
        },
      ],
    },
  ];

  for (const storyData of storiesData) {
    const existingStory = await prisma.story.findUnique({
      where: { slug: storyData.slug },
    });

    if (existingStory) {
      console.log(`⏭️  Story "${storyData.title}" already exists, skipping`);
      continue;
    }

    const story = await prisma.story.create({
      data: {
        title: storyData.title,
        slug: storyData.slug,
        description: storyData.description,
        status: storyData.status,
        viewCount: storyData.viewCount,
        authorId: author.id,
        publishedAt: storyData.status !== StoryStatus.DRAFT ? new Date() : null,
        genres: {
          create: [{ genreId: genres[storyData.genreIndex].id }],
        },
        tags:
          storyData.tagIndices.length > 0
            ? {
                create: storyData.tagIndices.map((i) => ({
                  tagId: tags[i].id,
                })),
              }
            : undefined,
      },
    });

    // Create chapters
    for (let i = 0; i < storyData.chapters.length; i++) {
      const ch = storyData.chapters[i];
      await prisma.chapter.create({
        data: {
          title: ch.title,
          content: ch.content,
          orderIndex: i + 1,
          wordCount: ch.wordCount,
          status: ChapterStatus.PUBLISHED,
          storyId: story.id,
          authorId: author.id,
          publishedAt: new Date(),
        },
      });
    }

    console.log(
      `✅ Story "${storyData.title}" created with ${storyData.chapters.length} chapters`,
    );
  }

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Test accounts:');
  console.log('   admin@reader.com  / Password123!  (ADMIN)');
  console.log('   author@reader.com / Password123!  (AUTHOR)');
  console.log('   reader@reader.com / Password123!  (READER)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
