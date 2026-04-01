import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { About } from './entities/about.entity';
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
        video: '',
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
        '<span class="text-orange-500">Young Adults</span> — yangi avlod uchun ta\'lim',
      main_title_en:
        '<span class="text-orange-500">Young Adults</span> — education for the new generation',
      main_title_ru:
        '<span class="text-orange-500">Young Adults</span> — образование для нового поколения',
      description_uz:
        'Til o‘qitish, IELTS va professional kurslar. Maqsadimiz — o‘quvchilarni xalqaro darajaga tayyorlash.',
      description_en: 'Language training, IELTS and professional courses.',
      description_ru: 'Языковые курсы, IELTS и профессиональные программы.',
      content_uz: 'Batafsil ma’lumot admin panel orqali yangilanadi.',
      content_en: 'Details are maintained via the admin panel.',
      content_ru: 'Подробности обновляются через админ-панель.',
      image1: '/uploads/seed/image.svg',
      image2: '/uploads/seed/customer-service.svg',
      image3: '/uploads/seed/photo_2025-07-28_10-42-28.svg',
      image4: '/uploads/seed/travel.svg',
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

    // COURSES (ensure by name_uz)
    for (const seed of [
      {
        name_uz: 'IELTS Intensive',
        name_en: 'IELTS Intensive',
        name_ru: 'IELTS Интенсив',
        description_uz:
          'Listening, Reading, Writing, Speaking bo‘yicha to‘liq tayyorgarlik. Haftada 3 kun.',
        description_en: 'Full preparation for all IELTS modules.',
        description_ru: 'Подготовка ко всем частям IELTS.',
        duration_uz: '3 oy',
        duration_en: '3 months',
        duration_ru: '3 месяца',
        daysPerWeek: 3,
        hoursPerDay: 2,
        icon: 'GraduationCap',
        image: '/uploads/seed/logo.svg',
        is_active: true,
      },
      {
        name_uz: 'Frontend dasturlash',
        name_en: 'Frontend Development',
        name_ru: 'Фронтенд разработка',
        description_uz: 'HTML, CSS, JavaScript, React — noldan loyihalar.',
        description_en: 'HTML, CSS, JavaScript, React from zero to projects.',
        description_ru: 'HTML, CSS, JavaScript, React с нуля.',
        duration_uz: '6 oy',
        duration_en: '6 months',
        duration_ru: '6 месяцев',
        daysPerWeek: 2,
        hoursPerDay: 3,
        icon: 'Code2',
        image: '/uploads/seed/logo_ya-coloured-black.svg',
        is_active: true,
      },
    ]) {
      const existing = await this.courseRepo.findOne({
        where: { name_uz: seed.name_uz } as any,
      });
      if (!existing) {
        await this.courseRepo.save(this.courseRepo.create(seed as any));
        result.coursesInserted += 1;
      } else {
        applyPatch(existing as any, seed as any);
        await this.courseRepo.save(existing);
        result.coursesUpdated += 1;
      }
    }

    // STATISTICS (ensure by label_uz)
    for (const seed of [
      {
        label_uz: 'Bitiruvchilar',
        label_en: 'Graduates',
        label_ru: 'Выпускники',
        value: 1200,
        icon: 'Users',
        image: '',
        order: 0,
        is_active: true,
      },
      {
        label_uz: 'O‘qituvchilar',
        label_en: 'Teachers',
        label_ru: 'Преподаватели',
        value: 45,
        icon: 'UserRound',
        image: '',
        order: 1,
        is_active: true,
      },
    ]) {
      const existing = await this.statsRepo.findOne({
        where: { label_uz: seed.label_uz } as any,
      });
      if (!existing) {
        await this.statsRepo.save(this.statsRepo.create(seed as any));
        result.statisticsInserted += 1;
      } else {
        applyPatch(existing as any, seed as any);
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

    // LOCATIONS (ensure by name_uz)
    const locSeed: Partial<Location> = {
      name_uz: 'Asosiy filial',
      name_en: 'Main campus',
      name_ru: 'Главный филиал',
      address_uz: 'Toshkent shahri (to‘liq manzilni admin qo‘shadi)',
      address_en: 'Tashkent (full address via admin)',
      address_ru: 'Ташкент (полный адрес в админке)',
      phone: '+998 90 000 00 00',
      image: '/uploads/seed/image.svg',
      coordinates: { lat: 41.3111, lng: 69.2797 } as any,
      is_active: true,
    };
    const locExisting = await this.locationRepo.findOne({
      where: { name_uz: locSeed.name_uz } as any,
    });
    if (!locExisting) {
      await this.locationRepo.save(this.locationRepo.create(locSeed as any));
      result.locationsInserted = 1;
    } else {
      applyPatch(locExisting as any, locSeed as any);
      await this.locationRepo.save(locExisting);
      result.locationsUpdated = 1;
    }

    // SERVICES (ensure by name_uz)
    for (const seed of [
      {
        name_uz: 'Buyuk Britaniya',
        name_en: 'United Kingdom',
        name_ru: 'Великобритания',
        flag: '/uploads/seed/travel.svg',
        description_uz: 'Universitetlar va IELTS talablari.',
        description_en: 'Universities and IELTS requirements.',
        description_ru: 'Университеты и требования IELTS.',
        minIELTS: '6.0',
        order: 0,
        is_active: true,
      },
      {
        name_uz: 'Germaniya',
        name_en: 'Germany',
        name_ru: 'Германия',
        flag: '/uploads/seed/travel.svg',
        description_uz: "Ta'lim va til sertifikatlari.",
        description_en: 'Study paths and language certificates.',
        description_ru: 'Обучение и языковые сертификаты.',
        minIELTS: '5.5',
        order: 1,
        is_active: true,
      },
    ]) {
      const existing = await this.serviceRepo.findOne({
        where: { name_uz: seed.name_uz } as any,
      });
      if (!existing) {
        await this.serviceRepo.save(this.serviceRepo.create(seed as any));
        result.servicesInserted += 1;
      } else {
        applyPatch(existing as any, seed as any);
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

