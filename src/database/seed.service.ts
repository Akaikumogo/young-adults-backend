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

  async seedPublicContent(): Promise<{
    heroesInserted: number;
    aboutInserted: number;
    coursesInserted: number;
    statisticsInserted: number;
    clientStatisticsInserted: number;
    locationsInserted: number;
    servicesInserted: number;
    slidesInserted: number;
    eventsInserted: number;
  }> {
    let heroesInserted = 0;
    let aboutInserted = 0;
    let coursesInserted = 0;
    let statisticsInserted = 0;
    let clientStatisticsInserted = 0;
    let locationsInserted = 0;
    let servicesInserted = 0;
    let slidesInserted = 0;
    let eventsInserted = 0;

    if ((await this.heroRepo.count()) === 0) {
      await this.heroRepo.save([
        this.heroRepo.create({
          content_uz:
            '<h1>Young Adults bilan kelajak sari</h1><p>Video slayd — til kurslari va abituriyentlar uchun dasturlar.</p>',
          content_en: '<h1>Step into your future with Young Adults</h1>',
          content_ru: '<h1>Young Adults — ваш путь к будущему</h1>',
          priority: 0,
          image: '',
          video: '/uploads/seed/massiv.mp4',
          is_active: true,
        }),
        this.heroRepo.create({
          content_uz:
            "<h1>Ta'lim va rivojlanish markazi</h1><p>IELTS, IT va boshqa yo'nalishlar.</p>",
          content_en: '<h1>Education and growth</h1>',
          content_ru: '<h1>Центр обучения</h1>',
          priority: 1,
          image: '/uploads/seed/young-adults2.png',
          video: '',
          is_active: true,
        }),
      ]);
      heroesInserted = 2;
    }

    if ((await this.aboutRepo.count()) === 0) {
      await this.aboutRepo.save(
        this.aboutRepo.create({
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
          description_ru:
            'Языковые курсы, IELTS и профессиональные программы.',
          content_uz: 'Batafsil ma’lumot admin panel orqali yangilanadi.',
          content_en: 'Details are maintained via the admin panel.',
          content_ru: 'Подробности обновляются через админ-панель.',
          image1: '/uploads/seed/about-1.jpg',
          image2: '/uploads/seed/about-2.jpg',
          image3: '/uploads/seed/about-3.jpg',
          image4: '/uploads/seed/about-4.jpg',
          is_active: true,
        }),
      );
      aboutInserted = 1;
    }

    if ((await this.courseRepo.count()) === 0) {
      await this.courseRepo.save([
        this.courseRepo.create({
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
          image: '/uploads/seed/course-ielts.jpg',
          is_active: true,
        }),
        this.courseRepo.create({
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
          image: '/uploads/seed/course-frontend.jpg',
          is_active: true,
        }),
      ]);
      coursesInserted = 2;
    }

    if ((await this.statsRepo.count()) === 0) {
      await this.statsRepo.save([
        this.statsRepo.create({
          label_uz: 'Bitiruvchilar',
          label_en: 'Graduates',
          label_ru: 'Выпускники',
          value: 1200,
          icon: 'Users',
          image: '',
          order: 0,
          is_active: true,
        }),
        this.statsRepo.create({
          label_uz: 'O‘qituvchilar',
          label_en: 'Teachers',
          label_ru: 'Преподаватели',
          value: 45,
          icon: 'UserRound',
          image: '',
          order: 1,
          is_active: true,
        }),
      ]);
      statisticsInserted = 2;
    }

    if ((await this.clientStatsRepo.count()) === 0) {
      await this.clientStatsRepo.save([
        this.clientStatsRepo.create({
          icon: 'Star',
          title_uz: 'O‘rtacha IELTS',
          title_en: 'Average IELTS',
          title_ru: 'Средний IELTS',
          value: 6.5,
          is_active: true,
        }),
        this.clientStatsRepo.create({
          icon: 'ThumbsUp',
          title_uz: 'Mamnun o‘quvchilar',
          title_en: 'Happy students',
          title_ru: 'Довольные студенты',
          value: '98%',
          is_active: true,
        }),
      ]);
      clientStatisticsInserted = 2;
    }

    if ((await this.locationRepo.count()) === 0) {
      await this.locationRepo.save(
        this.locationRepo.create({
          name_uz: 'Asosiy filial',
          name_en: 'Main campus',
          name_ru: 'Главный филиал',
          address_uz: 'Toshkent shahri (to‘liq manzilni admin qo‘shadi)',
          address_en: 'Tashkent (full address via admin)',
          address_ru: 'Ташкент (полный адрес в админке)',
          phone: '+998 90 000 00 00',
          image: '/uploads/seed/location.jpg',
          coordinates: { lat: 41.3111, lng: 69.2797 },
          is_active: true,
        }),
      );
      locationsInserted = 1;
    }

    if ((await this.serviceRepo.count()) === 0) {
      await this.serviceRepo.save([
        this.serviceRepo.create({
          name_uz: 'Buyuk Britaniya',
          name_en: 'United Kingdom',
          name_ru: 'Великобритания',
          flag: '/uploads/seed/flag-uk.png',
          description_uz: 'Universitetlar va IELTS talablari.',
          description_en: 'Universities and IELTS requirements.',
          description_ru: 'Университеты и требования IELTS.',
          minIELTS: '6.0',
          order: 0,
          is_active: true,
        }),
        this.serviceRepo.create({
          name_uz: 'Germaniya',
          name_en: 'Germany',
          name_ru: 'Германия',
          flag: '/uploads/seed/flag-de.png',
          description_uz: "Ta'lim va til sertifikatlari.",
          description_en: 'Study paths and language certificates.',
          description_ru: 'Обучение и языковые сертификаты.',
          minIELTS: '5.5',
          order: 1,
          is_active: true,
        }),
      ]);
      servicesInserted = 2;
    }

    if ((await this.slideRepo.count()) === 0) {
      await this.slideRepo.save(
        this.slideRepo.create({
          title_uz: 'Kurslarga yoziling',
          title_en: 'Enroll in courses',
          title_ru: 'Запишитесь на курсы',
          description_uz: 'IELTS va IT yo‘nalishlarida guruhlar ochiq.',
          description_en: 'Open groups for IELTS and IT tracks.',
          description_ru: 'Набор на IELTS и IT.',
          image: '/uploads/seed/slide-1.jpg',
          video: '',
          order: 0,
          is_active: true,
        }),
      );
      slidesInserted = 1;
    }

    if ((await this.eventRepo.count()) === 0) {
      await this.eventRepo.save(
        this.eventRepo.create({
          eventTitle_uz: 'Ochiq eshiklar kuni',
          eventTitle_en: 'Open doors day',
          eventTitle_ru: 'День открытых дверей',
          eventDescription_uz: 'Filialimizda bepul konsultatsiya va sayohat.',
          eventDescription_en: 'Free consultation on campus.',
          eventDescription_ru: 'Бесплатная консультация в филиале.',
          eventImage: '/uploads/seed/event.jpg',
          eventVideo: '',
          is_active: true,
        }),
      );
      eventsInserted = 1;
    }

    return {
      heroesInserted,
      aboutInserted,
      coursesInserted,
      statisticsInserted,
      clientStatisticsInserted,
      locationsInserted,
      servicesInserted,
      slidesInserted,
      eventsInserted,
    };
  }
}

