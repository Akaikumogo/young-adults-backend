import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { Employee, EmployeeDocument } from '../employees/schemas/employee.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';
import { About, AboutDocument } from '../about/schemas/about.schema';
import { Location, LocationDocument } from '../locations/schemas/location.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';

@Injectable()
export class ClearImagesService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(About.name) private aboutModel: Model<AboutDocument>,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
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
    // Clear Events images - use $set with empty string for required fields
    const eventsResult = await this.eventModel.updateMany(
      {},
      { $set: { eventImage: '', eventVideo: '' } }
    ).exec();

    // Clear Employees images
    const employeesResult = await this.employeeModel.updateMany(
      {},
      { $set: { image: '' } }
    ).exec();

    // Clear Users avatars
    const usersResult = await this.userModel.updateMany(
      {},
      { $set: { avatar_url: '' } }
    ).exec();

    // Clear Courses images and icons
    const coursesResult = await this.courseModel.updateMany(
      {},
      { $set: { image: '', icon: '' } }
    ).exec();

    // Clear About images array
    const aboutResult = await this.aboutModel.updateMany(
      {},
      { $set: { images: [] } }
    ).exec();

    // Clear Locations images (if exists)
    const locationsResult = await this.locationModel.updateMany(
      {},
      { $set: { image: '' } }
    ).exec();

    // Clear Services flags
    const servicesResult = await this.serviceModel.updateMany(
      {},
      { $set: { flag: '' } }
    ).exec();

    const total =
      eventsResult.modifiedCount +
      employeesResult.modifiedCount +
      usersResult.modifiedCount +
      coursesResult.modifiedCount +
      aboutResult.modifiedCount +
      locationsResult.modifiedCount +
      servicesResult.modifiedCount;

    return {
      events: eventsResult.modifiedCount,
      employees: employeesResult.modifiedCount,
      users: usersResult.modifiedCount,
      courses: coursesResult.modifiedCount,
      about: aboutResult.modifiedCount,
      locations: locationsResult.modifiedCount,
      services: servicesResult.modifiedCount,
      total,
    };
  }
}
