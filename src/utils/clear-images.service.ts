import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteEvent } from '../database/entities/event.entity';
import { Employee } from '../database/entities/employee.entity';
import { User } from '../database/entities/user.entity';
import { Course } from '../database/entities/course.entity';
import { About } from '../database/entities/about.entity';
import { Location } from '../database/entities/location.entity';
import { Service } from '../database/entities/service.entity';

@Injectable()
export class ClearImagesService {
  constructor(
    @InjectRepository(SiteEvent) private eventRepo: Repository<SiteEvent>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(About) private aboutRepo: Repository<About>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  async clearAllImages(): Promise<{
    events: number;
    employees: number;
    users: number;
    courses: number;
    about: number;
    locations: number;
    services: number;
    total: number;
  }> {
    const eventsResult = await this.eventRepo
      .createQueryBuilder()
      .update(SiteEvent)
      .set({ eventImage: '', eventVideo: '' })
      .execute();

    const employeesResult = await this.employeeRepo
      .createQueryBuilder()
      .update(Employee)
      .set({ image: '' })
      .execute();

    const usersResult = await this.userRepo
      .createQueryBuilder()
      .update(User)
      .set({ avatar_url: null })
      .execute();

    const coursesResult = await this.courseRepo
      .createQueryBuilder()
      .update(Course)
      .set({ image: null, icon: null })
      .execute();

    const aboutResult = await this.aboutRepo
      .createQueryBuilder()
      .update(About)
      .set({ image1: null, image2: null, image3: null, image4: null })
      .execute();

    const locationsResult = await this.locationRepo
      .createQueryBuilder()
      .update(Location)
      .set({ image: null })
      .execute();

    const servicesResult = await this.serviceRepo
      .createQueryBuilder()
      .update(Service)
      .set({ flag: '' })
      .execute();

    const events = eventsResult.affected || 0;
    const employees = employeesResult.affected || 0;
    const users = usersResult.affected || 0;
    const courses = coursesResult.affected || 0;
    const about = aboutResult.affected || 0;
    const locations = locationsResult.affected || 0;
    const services = servicesResult.affected || 0;

    return {
      events,
      employees,
      users,
      courses,
      about,
      locations,
      services,
      total:
        events +
        employees +
        users +
        courses +
        about +
        locations +
        services,
    };
  }
}
