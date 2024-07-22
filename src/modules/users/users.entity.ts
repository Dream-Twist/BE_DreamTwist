/**
File Name : users.entity
Description : Users Entity
Author : 박수정

History
Date        Author   Status    Description
2024.07.19  박수정   Created
*/
import { Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";
import { Posts } from "../posts/posts.entity";


@Entity({ schema: 'example1', name: 'users' })
export class Users{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar', {name:'email', unique:true ,length:30})
    email:string;  

    @Column('varchar',{name:'name', length:20})
    name:string;

    @Column('int',{name:'age'})
    age:number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToMany(
        ()=>Posts,
        (posts)=>posts.UserId
    )
    OwnedUserPosts:Posts[]
}
