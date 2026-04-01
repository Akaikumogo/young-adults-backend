import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { About } from './entities/about.entity';
import { Employee } from './entities/employee.entity';
import { Course } from './entities/course.entity';
import { Statistics } from './entities/statistics.entity';
import { ClientStatistics } from './entities/client-statistics.entity';
import { Location } from './entities/location.entity';
import { Service } from './entities/service.entity';
import { Slide } from './entities/slide.entity';
import { SiteEvent } from './entities/event.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Hero) private heroRepo: Repository<Hero>,
    @InjectRepository(About) private aboutRepo: Repository<About>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Statistics) private statsRepo: Repository<Statistics>,
    @InjectRepository(ClientStatistics)
    private clientStatsRepo: Repository<ClientStatistics>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Slide) private slideRepo: Repository<Slide>,
    @InjectRepository(SiteEvent) private eventRepo: Repository<SiteEvent>,
  ) {}

  async seedPublicContent(options?: { overwrite?: boolean }): Promise<{
    heroesInserted: number;
    heroesUpdated: number;
    aboutInserted: number;
    aboutUpdated: number;
    employeesInserted: number;
    employeesUpdated: number;
    coursesInserted: number;
    coursesUpdated: number;
    statisticsInserted: number;
    statisticsUpdated: number;
    clientStatisticsInserted: number;
    clientStatisticsUpdated: number;
    locationsInserted: number;
    locationsUpdated: number;
    servicesInserted: number;
    servicesUpdated: number;
    slidesInserted: number;
    slidesUpdated: number;
    eventsInserted: number;
    eventsUpdated: number;
  }> {
    const overwrite = options?.overwrite === true;

    const isEmpty = (v: unknown) => v === null || v === undefined || v === '';
    const shouldSet = (current: unknown, next: unknown) =>
      overwrite || (isEmpty(current) && !isEmpty(next));

    const applyPatch = (entity: Record<string, any>, patch: Record<string, any>) => {
      for (const [k, v] of Object.entries(patch)) {
        if (shouldSet(entity[k], v)) (entity as any)[k] = v;
      }
    };

    const result = {
      heroesInserted: 0,
      heroesUpdated: 0,
      aboutInserted: 0,
      aboutUpdated: 0,
      employeesInserted: 0,
      employeesUpdated: 0,
      coursesInserted: 0,
      coursesUpdated: 0,
      statisticsInserted: 0,
      statisticsUpdated: 0,
      clientStatisticsInserted: 0,
      clientStatisticsUpdated: 0,
      locationsInserted: 0,
      locationsUpdated: 0,
      servicesInserted: 0,
      servicesUpdated: 0,
      slidesInserted: 0,
      slidesUpdated: 0,
      eventsInserted: 0,
      eventsUpdated: 0,
    };

    // HERO (ensure by priority)
    for (const seed of [
      {
        priority: 0,
        content_uz:
          '<h1>Young Adults bilan kelajak sari</h1><p>Video slayd — til kurslari va abituriyentlar uchun dasturlar.</p>',
        content_en: '<h1>Step into your future with Young Adults</h1>',
        content_ru: '<h1>Young Adults — ваш путь к будущему</h1>',
        image: '/uploads/seed/Rectangle_3980_no_bg.svg',
        video: '/uploads/seed/massiv.mp4',
        is_active: true,
      },
      {
        priority: 1,
        content_uz:
          "<h1>Ta'lim va rivojlanish markazi</h1><p>IELTS, IT va boshqa yo'nalishlar.</p>",
        content_en: '<h1>Education and growth</h1>',
        content_ru: '<h1>Центр обучения</h1>',
        image: '/uploads/seed/Rectangle_3980_bg_removed_deep.svg',
        video: '',
        is_active: true,
      },
    ]) {
      const existing = await this.heroRepo.findOne({
        where: { priority: seed.priority } as any,
      });
      if (!existing) {
        await this.heroRepo.save(this.heroRepo.create(seed as any));
        result.heroesInserted += 1;
      } else {
        applyPatch(existing as any, seed as any);
        await this.heroRepo.save(existing);
        result.heroesUpdated += 1;
      }
    }

    // ABOUT (single row)
    const aboutSeed: Partial<About> = {
      title_uz: 'Biz haqimizda',
      title_en: 'About us',
      title_ru: 'О нас',
      main_title_uz:
        'Young Adults – bilim, ishonch va muvaffaqiyat <span class="text-orange-500">markazi!</span>',
      main_title_en:
        'Young Adults – a center of knowledge, confidence and success!',
      main_title_ru: 'Young Adults — центр знаний, уверенности и успеха!',
      description_uz:
        "🎓 Young Adults o‘quv markazi 2017-yilda tashkil etilgan bo‘lib, hozirgi kunga kelib 3 ta filial va 1 ta zamonaviy IT markaziga ega. Markazimiz bugunga qadar 5000 dan ortiq bitiruvchini yetishtirib, tumandagi yagona yirik qo‘shimcha ta’lim muassasasi sifatida tan olingan. Hozirda 1300 dan ortiq o‘quvchi tahsil olmoqda va ular orasida 80% dan ziyodi ingliz tilidan B2 yoki undan yuqori natijalarga erishgan. Shuningdek, 500 dan ortiq bitiruvchilarimiz dunyoning eng nufuzli — top 1000 talik oliygohlarida o‘qishni davom ettirishmoqda.",
      description_en:
        'Young Adults was founded in 2017 and now has 3 branches and an IT center. We have trained 5000+ graduates and currently teach 1300+ students.',
      description_ru:
        'Young Adults основан в 2017 году и сейчас имеет 3 филиала и IT-центр. Мы подготовили более 5000 выпускников и обучаем более 1300 студентов.',
      content_uz:
        "Asoschi: Yigitali Abdullayev — Young Adults asoschisi va bosh ilhomlantiruvchi.",
      content_en:
        'Founder: Yigitali Abdullaev — founder and main inspiration of Young Adults.',
      content_ru:
        'Основатель: Yigitali Abdullaev — основатель и главный вдохновитель Young Adults.',
      image1: '/uploads/seed/about-img.png',
      image2: '/uploads/seed/about-image2.png',
      image3: '/uploads/seed/aboiut-image3.png',
      image4: '/uploads/seed/youngAdults.jpg',
      is_active: true,
    };
    const aboutRows = await this.aboutRepo.find({
      order: { createdAt: 'ASC' } as any,
      take: 1,
    });
    const aboutExisting = aboutRows[0];
    if (!aboutExisting) {
      await this.aboutRepo.save(this.aboutRepo.create(aboutSeed as any));
      result.aboutInserted = 1;
    } else {
      applyPatch(aboutExisting as any, aboutSeed as any);
      await this.aboutRepo.save(aboutExisting);
      result.aboutUpdated = 1;
    }

    // EMPLOYEES (from young-adults constants; local images are missing in repo -> placeholder)
    const seedEmployees: Array<{
      name: string;
      role: string;
      birth?: string;
      description1: string;
      order: number;
    }> = [
      {
        name: 'Yigitali Abdullaev',
        role: 'CEO of Young Adults LLC',
        birth:
          'Yigitali Abdullaev was born in 1995, in Surkhandarya region of Uzbekistan Republic.',
        description1:
          'Yigitali Abdullaev is the Deputy of Jarkurgan Town and CEO of Young Adults Study, an educational center empowering youth in English, IT, and personal growth.',
        order: 0,
      },
      {
        name: 'Bekhruz Mansurov',
        role: 'IT Specialist',
        birth: 'Bekhruz was born in 2004 in Jarkurgan.',
        description1:
          'Frontend lead at Young Adults. Passionate about helping beginners in tech through hands-on projects and mentorship.',
        order: 1,
      },
      {
        name: 'Rasulbek Saidoov',
        role: 'IT Department Head',
        birth: 'Rasulbek was born in 2000 in Jarkurgan.',
        description1:
          'Studied in Germany, expert in Business Analytics and Python. Now leads the IT department, guiding students through modern technologies.',
        order: 2,
      },
      {
        name: 'Dilshod Yusupov',
        role: 'English Teacher',
        birth: 'Born in 1998 in Termiz.',
        description1:
          'TESOL-certified ESL instructor with over 5 years of teaching experience.',
        order: 3,
      },
      {
        name: 'Sevara Karimova',
        role: 'UX Designer',
        birth: 'Born in 2001 in Tashkent.',
        description1:
          'Specialized in educational UI/UX design for youth-focused platforms.',
        order: 4,
      },
      {
        name: 'Shahzodbek Rakhimov',
        role: 'Backend Developer',
        birth: 'Born in 1999 in Samarkand.',
        description1:
          'Backend specialist in Node.js and PostgreSQL, focused on scalable APIs.',
        order: 5,
      },
      {
        name: 'Zarina Omonova',
        role: 'Social Media Manager',
        birth: 'Born in 2002 in Bukhara.',
        description1:
          'Creates powerful digital stories and builds strong online communities.',
        order: 6,
      },
      {
        name: 'Ilhom Turaev',
        role: 'Mentor',
        birth: 'Born in 1990 in Karshi.',
        description1:
          'Guides students in career development with focus on growth mindset.',
        order: 7,
      },
    ];

    for (const seed of seedEmployees) {
      const existing = await this.employeeRepo.findOne({
        where: { name: seed.name, is_public: true } as any,
      });

      const patch: Partial<Employee> = {
        name: seed.name,
        role: seed.role,
        description1: [seed.birth, seed.description1].filter(Boolean).join('\n\n'),
        image: '/uploads/seed/Teacher3.webp',
        order: seed.order,
        is_active: true,
        is_public: true,
      };

      if (!existing) {
        await this.employeeRepo.save(this.employeeRepo.create(patch as any));
        result.employeesInserted += 1;
      } else {
        applyPatch(existing as any, patch as any);
        await this.employeeRepo.save(existing);
        result.employeesUpdated += 1;
      }
    }

    // COURSES (from young-adults constants/Courses.tsx; local images missing -> placeholder)
    const seedCourses: Array<{
      name: string;
      teacher: string;
      description: string;
      time: string;
      imageFile: string;
    }> = [
      {
        name: 'Kompyuter savodxonligi',
        teacher: 'Behruzbek Mansurov',
        description:
          "Kompyuter savodxonligi — foydalanuvchining kompyuter qurilmalari, dasturiy ta'minot va internet texnologiyalaridan maqsadga muvofiq, xavfsiz va mustaqil foydalana olish darajasidir.",
        time: '2 soat',
        imageFile: 'computer.png',
      },
      {
        name: 'Frontend dasturlash',
        teacher: 'Odilbek Safarov',
        description:
          "Frontend dasturlash — bu foydalanuvchi ko‘radigan va o‘zaro muloqot qiladigan veb-sayt yoki ilovaning tashqi ko‘rinishini (interfeysini) yaratish jarayonidir. Bunga dizaynni kodga aylantirish, elementlar joylashuvi, interaktiv tugmalar, menyular, formalar va animatsiyalar kiradi.",
        time: '2 soat',
        imageFile: 'front-end.png',
      },
      {
        name: 'Backend dasturlash',
        teacher: 'Rasulbek Hamdamov',
        description:
          "Backend dasturlash — bu veb-sayt yoki ilovaning server tomonini dasturlash jarayonidir.Bu ma’lumotlar bazasi, server, va APIlar bilan ishlaydigan, foydalanuvchi so‘rovlariga javob beradigan dasturlash. Hamda foydalanuvchi ko‘rmaydigan, ammo tizimning ishlashi uchun muhim bo‘lgan qism.",
        time: '2 soat',
        imageFile: 'backend.png',
      },
      {
        name: 'Foundation kursi',
        teacher: 'Odilbek Safarov',
        description:
          "Foundation kursi — bu dasturlashni o‘rganishni istaganlar uchun mo‘ljallangan boshlang‘ich (asosiy) kurs bo‘lib,bunda noldan boshlovchilar uchun mo‘ljallangan kurs bo‘lib, u dasturlashga kirish, asosiy mantiq va kod yozish ko‘nikmalarini beradi. Shuningdek kompyuter, algoritm, kod yozish, va dasturlash tillarining asosiy tushunchalari o‘rgatiladi..",
        time: '2 soat',
        imageFile: 'foundation.png',
      },
      {
        name: 'IELTS',
        teacher: 'Rasulbek Hamdamov',
        description:
          "IELTS (International English Language Testing System) — bu xalqaro miqyosda tan olingan ingliz tili imtihoni bo‘lib, u ingliz tilini o‘qish, yozish, tinglash va gapirish bo‘yicha bilimingizni baholaydi.",
        time: '2 soat',
        imageFile: 'IELTS.jpg',
      },
      {
        name: 'CEFR',
        teacher: 'Behruzbek Mansurov',
        description:
          "CEFR (Common European Framework of Reference for Languages) — bu xorijiy tillardagi til bilish darajalarini baholash uchun ishlatiladigan xalqaro standart tizim.",
        time: '2 soat',
        imageFile: 'cefr.png',
      },
      {
        name: 'Ingliz tili grammatikasi',
        teacher: 'Laziza Tolibjonova',
        description:
          'Ingliz tili grammatikasi — bu ingliz tilida to‘g‘ri gap tuzish, so‘zlarni o‘zaro bog‘lash va fikrni aniq ifodalash uchun qo‘llaniladigan qoidalar to‘plami.',
        time: '2 soat',
        imageFile: 'grammar.jpg',
      },
      {
        name: 'Ona Tili (Milliy sertifikat)',
        teacher: 'Laziza Tolibjonova',
        description:
          "Milliy sertifikat — bu O‘zbekiston Respublikasi fuqarolari uchun o‘zbek tilidan bilim darajasini baholaydigan rasmiy imtihon va hujjat bo‘lib, O‘zbek tili bo‘yicha rasmiy til bilimini tasdiqlaydi.",
        time: '2 soat',
        imageFile: 'onatili.jpg',
      },
    ];

    for (const seed of seedCourses) {
      const patch: Partial<Course> = {
        name_uz: seed.name,
        name_en: seed.name,
        name_ru: seed.name,
        description_uz: seed.description,
        description_en: seed.description,
        description_ru: seed.description,
        duration_uz: seed.time,
        duration_en: seed.time,
        duration_ru: seed.time,
        daysPerWeek: null,
        hoursPerDay: null,
        icon: null,
        image: `/uploads/seed/${seed.imageFile}`,
        is_active: true,
      };

      let teacher = await this.employeeRepo.findOne({
        where: { name: seed.teacher, is_public: true } as any,
      });
      if (!teacher) {
        const saved = await this.employeeRepo.save(
          this.employeeRepo.create({
            name: seed.teacher,
            role: 'Teacher',
            description1: '',
            image: '/uploads/seed/Teacher3.webp',
            order: 100,
            is_active: true,
            is_public: true,
            department: null,
            position: null,
            login: null,
            password: null,
          } as any),
        );
        teacher = (Array.isArray(saved) ? saved[0] : saved) as Employee;
        result.employeesInserted += 1;
      }

      const existing = await this.courseRepo.findOne({
        where: { name_uz: patch.name_uz } as any,
        relations: { employees: true } as any,
      });

      if (!existing) {
        await this.courseRepo.save(
          this.courseRepo.create({
            ...(patch as any),
            employees: [teacher],
          }),
        );
        result.coursesInserted += 1;
      } else {
        applyPatch(existing as any, patch as any);
        const employees = Array.isArray((existing as any).employees)
          ? (existing as any).employees
          : [];
        const hasTeacher = employees.some((e: Employee) => e?._id === teacher!._id);
        if (!hasTeacher) (existing as any).employees = [...employees, teacher];
        await this.courseRepo.save(existing);
        result.coursesUpdated += 1;
      }
    }

    // STATISTICS (from young-adults constants/Data.tsx)
    for (const seed of [
      { label: 'Bitiruvchilar soni', count: 5000, order: 0 },
      { label: "O'quvchilar soni", count: 1345, order: 1 },
      { label: "O'qituvchilar soni", count: 31, order: 2 },
      { label: 'Filiallar soni', count: 4, order: 3 },
    ]) {
      const patch: Partial<Statistics> = {
        label_uz: seed.label,
        label_en: seed.label,
        label_ru: seed.label,
        value: seed.count,
        icon: '',
        image: '',
        order: seed.order,
        is_active: true,
      };
      const existing = await this.statsRepo.findOne({
        where: { label_uz: patch.label_uz } as any,
      });
      if (!existing) {
        await this.statsRepo.save(this.statsRepo.create(patch as any));
        result.statisticsInserted += 1;
      } else {
        applyPatch(existing as any, patch as any);
        await this.statsRepo.save(existing);
        result.statisticsUpdated += 1;
      }
    }

    // CLIENT STATISTICS (ensure by title_uz + icon)
    for (const seed of [
      {
        icon: 'Star',
        title_uz: 'O‘rtacha IELTS',
        title_en: 'Average IELTS',
        title_ru: 'Средний IELTS',
        value: 6.5,
        is_active: true,
      },
      {
        icon: 'ThumbsUp',
        title_uz: 'Mamnun o‘quvchilar',
        title_en: 'Happy students',
        title_ru: 'Довольные студенты',
        value: '98%',
        is_active: true,
      },
    ]) {
      const existing = await this.clientStatsRepo.findOne({
        where: { title_uz: seed.title_uz, icon: seed.icon } as any,
      });
      if (!existing) {
        await this.clientStatsRepo.save(
          this.clientStatsRepo.create(seed as any),
        );
        result.clientStatisticsInserted += 1;
      } else {
        applyPatch(existing as any, seed as any);
        await this.clientStatsRepo.save(existing);
        result.clientStatisticsUpdated += 1;
      }
    }

    // LOCATIONS (from young-adults components/Locations.tsx; local images missing -> placeholder)
    for (const seed of [
      { name: "Yangi O'zbekiston", phone: '+99890 295 70 07' },
      { name: "Istiqlol ko'chasi", phone: '+99890 295 70 07' },
      { name: 'Grammar Campus', phone: '+99890 295 70 07' },
    ]) {
      const patch: Partial<Location> = {
        name_uz: seed.name,
        name_en: seed.name,
        name_ru: seed.name,
        address_uz: "Manzil admin panel orqali to'ldiriladi.",
        address_en: 'Address is maintained via the admin panel.',
        address_ru: 'Адрес заполняется через админ-панель.',
        phone: seed.phone,
        image:
          seed.name === "Yangi O'zbekiston"
            ? '/uploads/seed/young-adults2.png'
            : seed.name === "Istiqlol ko'chasi"
              ? '/uploads/seed/istiqlolBranch.jpg'
              : '/uploads/seed/grammarCampus.jpg',
        coordinates: null,
        is_active: true,
      };

      const existing = await this.locationRepo.findOne({
        where: { name_uz: patch.name_uz } as any,
      });
      if (!existing) {
        await this.locationRepo.save(this.locationRepo.create(patch as any));
        result.locationsInserted += 1;
      } else {
        applyPatch(existing as any, patch as any);
        await this.locationRepo.save(existing);
        result.locationsUpdated += 1;
      }
    }

    // SERVICES (from young-adults constants/Consulting.tsx)
    for (const seed of [
      {
        name: 'United Kingdom',
        flag: 'https://flagcdn.com/gb.svg',
        minIELTS: '6.5',
        description:
          "UK universitetlari kuchli akademik dasturlar bilan mashhur. Ko'plab grant va foundation imkoniyatlari mavjud.",
        order: 0,
      },
      {
        name: 'United States',
        flag: 'https://flagcdn.com/us.svg',
        minIELTS: '6.5 - 7.0',
        description:
          "AQShdagi universitetlar dunyoning eng yaxshi oliygohlari qatoriga kiradi. Talabalar campus hayotidan zavqlanishadi.",
        order: 1,
      },
      {
        name: 'Canada',
        flag: 'https://flagcdn.com/ca.svg',
        minIELTS: '6.0',
        description:
          "Kanada - sifatli ta'lim va xavfsiz muhit uchun mashhur. Immigratsion imkoniyatlar ham mavjud.",
        order: 2,
      },
      {
        name: 'Australia',
        flag: 'https://flagcdn.com/au.svg',
        minIELTS: '6.0 - 6.5',
        description:
          "Australia innovatsion ta'lim tizimi va go'zal tabiatga ega. Talabalar uchun flexible vizalar mavjud.",
        order: 3,
      },
      {
        name: 'Germany',
        flag: 'https://flagcdn.com/de.svg',
        minIELTS: '6.0',
        description:
          "Germaniyada ko'plab universitetlar bepul o'qitadi. IELTS talab qilinadi, lekin ba'zilarida alternativ variantlar mavjud.",
        order: 4,
      },
    ]) {
      const patch: Partial<Service> = {
        name_uz: seed.name,
        name_en: seed.name,
        name_ru: seed.name,
        flag: seed.flag,
        description_uz: seed.description,
        description_en: seed.description,
        description_ru: seed.description,
        minIELTS: seed.minIELTS,
        order: seed.order,
        is_active: true,
      };

      const existing = await this.serviceRepo.findOne({
        where: { name_uz: patch.name_uz } as any,
      });
      if (!existing) {
        await this.serviceRepo.save(this.serviceRepo.create(patch as any));
        result.servicesInserted += 1;
      } else {
        applyPatch(existing as any, patch as any);
        await this.serviceRepo.save(existing);
        result.servicesUpdated += 1;
      }
    }

    // SLIDES (ensure by title_uz + order)
    const slideSeed: Partial<Slide> = {
      title_uz: 'Kurslarga yoziling',
      title_en: 'Enroll in courses',
      title_ru: 'Запишитесь на курсы',
      description_uz: 'IELTS va IT yo‘nalishlarida guruhlar ochiq.',
      description_en: 'Open groups for IELTS and IT tracks.',
      description_ru: 'Набор на IELTS и IT.',
      image: '/uploads/seed/footerLogo.svg',
      video: '',
      order: 0,
      is_active: true,
    };
    const slideExisting = await this.slideRepo.findOne({
      where: { title_uz: slideSeed.title_uz, order: slideSeed.order } as any,
    });
    if (!slideExisting) {
      await this.slideRepo.save(this.slideRepo.create(slideSeed as any));
      result.slidesInserted = 1;
    } else {
      applyPatch(slideExisting as any, slideSeed as any);
      await this.slideRepo.save(slideExisting);
      result.slidesUpdated = 1;
    }

    // EVENTS (ensure by eventTitle_uz)
    const eventSeed: Partial<SiteEvent> = {
      eventTitle_uz: 'Ochiq eshiklar kuni',
      eventTitle_en: 'Open doors day',
      eventTitle_ru: 'День открытых дверей',
      eventDescription_uz: 'Filialimizda bepul konsultatsiya va sayohat.',
      eventDescription_en: 'Free consultation on campus.',
      eventDescription_ru: 'Бесплатная консультация в филиале.',
      eventImage: '/uploads/seed/photo_2025-07-28_10-42-28.svg',
      eventVideo: '',
      is_active: true,
    };
    const eventExisting = await this.eventRepo.findOne({
      where: { eventTitle_uz: eventSeed.eventTitle_uz } as any,
    });
    if (!eventExisting) {
      await this.eventRepo.save(this.eventRepo.create(eventSeed as any));
      result.eventsInserted = 1;
    } else {
      applyPatch(eventExisting as any, eventSeed as any);
      await this.eventRepo.save(eventExisting);
      result.eventsUpdated = 1;
    }

    return result;
  }
}

