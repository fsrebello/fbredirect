import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const endpoint = process.env.GRAPHQL_ENDPOINT as string;
// deleted 27Aug2024
//	const graphQLClient = new GraphQLClient(endpoint);
// deleted 27Aug2024

// Added 27Aug2024

	    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`).toString('base64')}`,
        },
    });
	
// Added 27Aug2024

	const referringURL = ctx.req.headers?.referer || null;
	const pathArr = ctx.query.postpath as Array<string>;
	const path = pathArr.join('/');
	console.log(path);
	const fbclid = ctx.query.fbclid;

	// redirect if facebook is the referer or request contains fbclid
		if (referringURL?.includes('facebook.com') || fbclid) {

		return {
			redirect: {
				permanent: false,
	// deleted 27Aug2024
		
//				destination: `${
//					`https://usatrendinghour.com/` + encodeURI(path as string)
//				}`,
	// deleted 27Aug2024

// Added 27Aug2024
				
			destination: `https://usatrendinghour.com/${encodeURI(path as string)}`,
// Added 27Aug2024


			},
		};
		}

// Deleted 29Aug2024
	
//	const query = gql`
//		{
//			post(id: "/${path}/", idType: URI) {
//				id
//				excerpt
//				title
//				link
//				dateGmt
//				modifiedGmt
//				content
//				author {
//					node {
//						name
//					}
//				}
//				featuredImage {
//					node {
//						sourceUrl
//						altText
//					}
//				}
//			}
//		}
//	`;
// Deleted 29Aug2024

// Added 29Aug2024
const query = gql`
    {
        post(id: "/${path}/", idType: URI) {
            title
            featuredImage {
                node {
                    sourceUrl
                    altText
                }
            }
        }
    }
`;
	
	
// Added 29Aug2024


	
	
// Added 27Aug2024

  try {

// Added 27Aug2024
  
	const data = await graphQLClient.request(query);
	if (!data.post) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			path,
			post: data.post,
			host: ctx.req.headers.host,
		},
	};

// Added 27Aug2024

} catch (error) {
        console.error('GraphQL request failed:', error);
        return {
            notFound: true,
        };
    }
// Added 27Aug2024
	  
};


// Deleted 29Aug2024
//interface PostProps {
//	post: any;
//	host: string;
//	path: string;
//}
// Deleted 29Aug2024

// Added 29Aug2024

interface PostProps {
    post: {
        title: string;
        featuredImage: {
            node: {
                sourceUrl: string;
                altText: string;
            };
        };
    };
}

// Added 29Aug2024




// Deleted 29Aug2024
//const Post: React.FC<PostProps> = (props) => {
//	const { post, host, path } = props;
//
//	// to remove tags from excerpt
//	const removeTags = (str: string) => {
//		if (str === null || str === '') return '';
//		else str = str.toString();
//		return str.replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
//	};
//
//	return (
//		<>
//			<Head>
//				<meta property="og:title" content={post.title} />
//				<meta property="og:description" content={removeTags(post.excerpt)} />
//				<meta property="og:type" content="article" />
//				<meta property="og:locale" content="en_US" />
//				<meta property="og:site_name" content={host.split('.')[0]} />
//				<meta property="article:published_time" content={post.dateGmt} />
//				<meta property="article:modified_time" content={post.modifiedGmt} />
//				<meta property="og:image" content={post.featuredImage.node.sourceUrl} />
//				<meta
//					property="og:image:alt"
//					content={post.featuredImage.node.altText || post.title}
//				/>
//				<title>{post.title}</title>
//			</Head>
//			<div className="post-container">
//				<h1>{post.title}</h1>
//				<picture>
//				<img
//					src={post.featuredImage.node.sourceUrl}
//					alt={post.featuredImage.node.altText || post.title}
//				/>
//				</picture>
//				<article dangerouslySetInnerHTML={{ __html: post.content }} />
//			</div>
//		</>
//	);
//};
// Deleted 29Aug2024


// Added 29Aug2024

const Post: React.FC<PostProps> = (props) => {
    const { post } = props;

    return (
        <>
            <Head>
                <meta property="og:title" content={post.title} />
                <meta property="og:image" content={post.featuredImage.node.sourceUrl} />
                <title>{post.title}</title>
            </Head>
            <div className="post-container">
                <h1>{post.title}</h1>
                {post.featuredImage && (
                    <picture>
                        <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                        />
                    </picture>
                )}
            </div>
        </>
    );
};

// Added 29Aug2024





export default Post;
