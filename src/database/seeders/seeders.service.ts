import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { fa, faker } from '@faker-js/faker';
import { Cuisine } from 'src/cuisine/entities/cuisine.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import * as bcrypt from "bcrypt"
import { Roles } from 'src/user/enums/roles.enum';


@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectModel(Cuisine.name) private cuisineModel: Model<Cuisine>,
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Follow.name) private followModel: Model<Follow>,
    ) { }

    /**
     * Main seeding function
     */
    async seed() {
        try {
            this.logger.log('🌱 Starting database seeding...');

            // Clear existing data
            await this.clearDatabase();

            // Seed in order (respecting foreign key relationships)
            const cuisines = await this.seedCuisines();
            const users = await this.seedUsers(cuisines);
            const restaurants = await this.seedRestaurants(cuisines, users);
            await this.seedFollows(users, restaurants);

            this.logger.log('✅ Database seeding completed successfully!');
            this.printSummary(cuisines, restaurants, users);
        } catch (error) {
            this.logger.error('❌ Seeding failed:', error);
            throw error;
        }
    }

    /**
     * Clear all collections
     */
    private async clearDatabase() {
        this.logger.log('🧹 Clearing existing data...');
        await Promise.all([
            this.cuisineModel.deleteMany({}),
            this.restaurantModel.deleteMany({}),
            this.userModel.deleteMany({}),
            this.followModel.deleteMany({}),
        ]);
        this.logger.log('✓ Database cleared');
    }

    /**
     * Seed Cuisines
     */
    private async seedCuisines(): Promise<Cuisine[]> {
        this.logger.log('🍜 Seeding cuisines...');

        const cuisineData = [
            { name: 'Asian', slug: 'asian', description: 'Asian cuisine including Chinese, Japanese, Thai, Korean, and Vietnamese dishes' },
            { name: 'Burgers', slug: 'burgers', description: 'Burgers, sandwiches, and American fast food' },
            { name: 'Pizza', slug: 'pizza', description: 'Pizza and Italian fast food' },
            { name: 'Italian', slug: 'italian', description: 'Traditional Italian cuisine including pasta, risotto, and more' },
            { name: 'Mexican', slug: 'mexican', description: 'Mexican cuisine including tacos, burritos, and quesadillas' },
            { name: 'Middle Eastern', slug: 'middle-eastern', description: 'Middle Eastern cuisine including kebabs, shawarma, and mezze' },
            { name: 'Indian', slug: 'indian', description: 'Indian cuisine with curries, tandoori, and biryani' },
            { name: 'Seafood', slug: 'seafood', description: 'Fresh seafood and fish dishes' },
            { name: 'Desserts', slug: 'desserts', description: 'Sweet treats, cakes, ice cream, and desserts' },
            { name: 'Healthy', slug: 'healthy', description: 'Healthy options including salads, smoothies, and organic dishes' },
            { name: 'Fried', slug: 'fried', description: 'Fried chicken, fries, and other fried comfort food' },
            { name: 'BBQ', slug: 'bbq', description: 'Barbecue and grilled meats' },
        ];

        const cuisines = await this.cuisineModel.insertMany(cuisineData);
        this.logger.log(`✓ Created ${cuisines.length} cuisines`);
        return cuisines;
    }


    /**
    * Seed Users
    */
    private async seedUsers(cuisines: Cuisine[]): Promise<User[]> {
        this.logger.log('👥 Seeding users...');

        // Use Partial<User> so TS doesn't expect the whole User document structure
        const users: Partial<User>[] = [];

        for (let i = 0; i < 50; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();

            const numFavoriteCuisines = faker.number.int({ min: 1, max: 5 });
            const favoriteCuisines = faker.helpers.arrayElements(cuisines, numFavoriteCuisines);

            users.push({
                fullName: `${firstName} ${lastName}`,
                email: faker.internet.email({ firstName, lastName }).toLowerCase(),
                username: faker.internet.username({ firstName, lastName }).toLowerCase(),
                phone: `+20${faker.string.numeric(10)}`,
                password: await bcrypt.hash('Password123', Number(process.env.SALT_ROUNDS)),
                role: Roles.USER,
                preferences: {
                    favoriteCuisinesIds: favoriteCuisines.map(c => c.id),
                    darkMode: faker.datatype.boolean(),
                    language: "en", // or faker.helpers.arrayElement(['en','ar','fr'])
                },
                profile: {
                    totalFollowing: 0,
                    bio: faker.lorem.paragraph(),
                }
            });
        }

        // `as any` is ok here because insertMany accepts raw objects
        const createdUsers = await this.userModel.insertMany(users);
        this.logger.log(`✓ Created ${createdUsers.length} users`);
        return createdUsers as User[];
    }


    /**
     * Seed Restaurants
     */
    private async seedRestaurants(cuisines: Cuisine[], users: User[]): Promise<Restaurant[]> {
        this.logger.log('🍽️  Seeding restaurants...');

        const restaurants: Partial<Restaurant>[] = [];
        const cairoCoordinates = [31.2357, 30.0444]; // Cairo center

        // Predefined restaurant names for realism
        const restaurantNames = [
            { en: 'Tokyo Sushi House', ar: 'بيت طوكيو للسوشي' },
            { en: 'Burger Masters', ar: 'أساتذة البرجر' },
            { en: 'Pizza Palace', ar: 'قصر البيتزا' },
            { en: 'Spice Garden', ar: 'حديقة التوابل' },
            { en: 'The Golden Fork', ar: 'الشوكة الذهبية' },
            { en: 'Ocean Breeze Seafood', ar: 'نسيم المحيط للمأكولات البحرية' },
            { en: 'Mama\'s Kitchen', ar: 'مطبخ ماما' },
            { en: 'Street Food Express', ar: 'إكسبريس الطعام السريع' },
            { en: 'The Healthy Bowl', ar: 'وعاء الصحة' },
            { en: 'BBQ Nation', ar: 'أمة الشواء' },
            { en: 'Sweet Dreams Desserts', ar: 'حلويات الأحلام الجميلة' },
            { en: 'Fusion Kitchen', ar: 'مطبخ الدمج' },
            { en: 'Royal Feast', ar: 'المأدبة الملكية' },
            { en: 'Noodle House', ar: 'بيت النودلز' },
            { en: 'Taco Fiesta', ar: 'تاكو فييستا' },
            { en: 'Mediterranean Delight', ar: 'بهجة البحر المتوسط' },
            { en: 'Chicken Paradise', ar: 'جنة الدجاج' },
            { en: 'Veggie Heaven', ar: 'جنة الخضروات' },
            { en: 'Grill Master', ar: 'سيد المشاوي' },
            { en: 'Café Istanbul', ar: 'مقهى اسطنبول' },
        ];

        for (let i = 0; i < restaurantNames.length; i++) {
            const name = restaurantNames[i];

            // Random location within 5km of Cairo center
            const longitude = cairoCoordinates[0] + (Math.random() - 0.5) * 0.1;
            const latitude = cairoCoordinates[1] + (Math.random() - 0.5) * 0.1;

            // Select 1-3 random cuisines
            const numCuisines = faker.number.int({ min: 1, max: 3 });
            const selectedCuisines = faker.helpers.arrayElements(cuisines, numCuisines);

            const slug = name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            restaurants.push({
                nameEn: name.en,
                nameAr: name.ar,
                slug: slug,
                cuisinesIds: selectedCuisines.map(c => c.id),
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
                totalFollowers: 0,
                descriptionEn: faker.lorem.sentences(2),
                descriptionAr: faker.lorem.sentences(2),
                createdById: faker.helpers.arrayElement(users).id,
            });
        }

        const createdRestaurants = await this.restaurantModel.insertMany(restaurants);
        this.logger.log(`✓ Created ${createdRestaurants.length} restaurants`);
        return createdRestaurants as Restaurant[];
    }



    /**
     * Seed Follows (User-Restaurant relationships)
     */
    private async seedFollows(users: User[], restaurants: Restaurant[]) {
        this.logger.log('❤️  Seeding follows...');

        const follows: any[] = [];
        const followSet = new Set<string>(); // Prevent duplicates

        // Each user follows 3-10 random restaurants
        for (const user of users) {
            const numFollows = faker.number.int({ min: 3, max: 10 });
            const restaurantsToFollow = faker.helpers.arrayElements(restaurants, numFollows);

            for (const restaurant of restaurantsToFollow) {
                const followKey = `${user._id}-${restaurant._id}`;

                if (!followSet.has(followKey)) {
                    followSet.add(followKey);
                    follows.push({
                        userId: user._id,
                        restaurantId: restaurant._id,
                    });
                }
            }

        }
        for (const follow of follows) {
            // increment restaurant followers
            await this.restaurantModel.updateOne(
                { _id: follow.restaurantId },
                { $inc: { totalFollowers: 1 } }
            );

            // increment user following count
            await this.userModel.updateOne(
                { _id: follow.userId },
                { $inc: { 'profile.totalFollowing': 1 } }
            );
        }

        await this.followModel.insertMany(follows);
        this.logger.log(`✓ Created ${follows.length} follows`);
    }

    /**
     * Print seeding summary
     */
    private printSummary(cuisines: Cuisine[], restaurants: Restaurant[], users: User[]) {
        this.logger.log('\n📊 Seeding Summary:');
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.logger.log(`🍜 Cuisines: ${cuisines.length}`);
        this.logger.log(`🍽️  Restaurants: ${restaurants.length}`);
        this.logger.log(`👥 Users: ${users.length}`);
        this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Sample data
        this.logger.log('📝 Sample Cuisine:', cuisines[0].name);
        this.logger.log('📝 Sample Restaurant:', restaurants[0].nameEn);
        this.logger.log('📝 Sample User:', users[0].fullName);
    }
}