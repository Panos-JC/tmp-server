// NestJS
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Local files
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrendingModule } from './tmdb/trending/trending.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { entities } from './entities';
import { MovieModule } from './movie/movie.module';
import { TvModule } from './tv/tv.module';
import { TmdbModule } from './tmdb/tmdb.module';

let envFilePath = 'development.env';

if (process.env.NODE_ENV === 'production') {
  envFilePath = '.env.production';
}

console.log('Running in ', process.env.NODE_ENV);
console.log('s in ', process.env.DB_HOST);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tmp-pg-db2',
      entities,
      synchronize: true,
      logging: true,
    }),
    TmdbModule,
    MovieModule,
    TvModule,
    TrendingModule,
    HttpModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
